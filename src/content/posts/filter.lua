-- Toggle how Org example blocks are rendered:
--   "off"  -> leave as normal fenced code block (no special handling)
--   "ansi" -> render as ```ansi showLineNumbers=false frame="none"
--   "div"  -> render as a <div class="font-mono" ...> with preformatted text
local EXAMPLE_MODE = "div" -- "off" | "ansi" | "div"

-- Controls the CSS classes used when EXAMPLE_MODE == "div"
local EXAMPLE_DIV_CLASSES = "font-mono example-block__content"

-- HTML prefix inserted before *every* example block in both "ansi" and "div" modes
local EX_PREFIX = [[
<div class="font-mono example-block__label">Output:</div>
]]

----------------------------------------------------------------------
-- Shared slugify logic (GitHub‑like anchors)
----------------------------------------------------------------------

local function slugify_github_like(t)
    -- trim leading/trailing whitespace
    t = t:gsub("^%s+", ""):gsub("%s+$", "")

    -- lowercase
    t = t:lower()

    -- Remove characters that are NOT:
    --   - word chars (%w)  -> letters/digits/underscore
    --   - spaces (%s)
    --   - hyphen (-)
    -- This preserves spaces and existing hyphens (so multiple separators
    -- can become multiple hyphens, e.g. "Intro & Usage" -> "intro--usage").
    t = t:gsub("[^%w%s%-]", "")

    -- Convert spaces to hyphens, but do NOT collapse multiple hyphens.
    t = t:gsub("%s", "-")

    -- Trim leading/trailing hyphens
    t = t:gsub("^-+", ""):gsub("-+$", "")

    if t == "" then
        t = "section"
    end
    return t
end

----------------------------------------------------------------------
-- Org metadata capture (# +KEY: value)
----------------------------------------------------------------------

local variables = {}

function RawBlock(el)
    if el.format == "org" then
        local name, value = el.text:match("#%+(%w+):%s*(.+)$")
        if name and value then
            variables[name] = value
            return {} -- remove this raw block from AST
        end
    end
    return nil
end

function Meta(meta)
    for name, value in pairs(variables) do
        local lower_name = name:lower()

        if lower_name == "draft" then
            -- boolean
            local v = value:lower()
            if v == "true" then
                meta[name] = pandoc.MetaBool(true)
            elseif v == "false" then
                meta[name] = pandoc.MetaBool(false)
            else
                meta[name] = pandoc.MetaString(value)
            end
        elseif lower_name == "tags" then
            -- e.g. "[demo, testing]" → MetaList of MetaString
            local list = {}
            for tag in value:gmatch("[%w_-]+") do
                table.insert(list, pandoc.MetaString(tag))
            end
            meta[name] = pandoc.MetaList(list)
        elseif lower_name == "title" or lower_name == "description" then
            meta[name] = pandoc.MetaString(value)
        elseif lower_name == "series" then
            -- Parse { name: "...", part: N } into MetaMap
            local series_name = value:match('name:%s*"([^"]*)"')
            local series_part = value:match('part:%s*(%d+)')
            if series_name and series_part then
                meta[name] = pandoc.MetaMap({
                    name = pandoc.MetaString(series_name),
                    part = pandoc.MetaString(series_part)
                })
            else
                meta[name] = pandoc.MetaString(value)
            end
        else
            meta[name] = pandoc.MetaString(value)
        end
    end

    return meta
end

----------------------------------------------------------------------
-- Example block rendering (Org #+begin_example)
----------------------------------------------------------------------

local function render_example_ansi(cb)
    local fence = '```ansi showLineNumbers=false frame="none"'
    local code  = fence .. "\n" .. cb.text .. "\n```"
    -- Prefix is HTML; code fence is Markdown → emit both in one markdown RawBlock
    local md    = EX_PREFIX .. "\n" .. code
    return pandoc.RawBlock("markdown", md)
end

local function render_example_div(cb)
    -- Use configurable EXAMPLE_DIV_CLASSES
    -- Wrap in a container to handle scrollbars and gradients properly
    local open_wrapper = '<div class="example-block__wrapper">\n'
    local close_wrapper = '</div>'

    local open_div =
        '<div class="' .. EXAMPLE_DIV_CLASSES .. '">'
    local close_div = "</div>"

    local html = EX_PREFIX .. "" .. open_wrapper .. open_div .. cb.text .. close_div .. close_wrapper
    return pandoc.RawBlock("html", html)
end

----------------------------------------------------------------------
-- CodeBlock handling (Org example + mdparams + #+NAME anchors)
----------------------------------------------------------------------

local function make_anchor_span(id_str)
    local slug = slugify_github_like(id_str)
    local html = '<span id="' .. slug .. '" class="anchor-target"></span>'
    return pandoc.RawBlock("html", html)
end

function CodeBlock(cb)
    local classes     = cb.attr.classes
    local attrs       = cb.attr.attributes

    --------------------------------------------------------------------
    -- 0. If there is an Org #+NAME (stored as identifier), add an anchor
    --------------------------------------------------------------------
    local anchor_span = nil
    if cb.identifier and cb.identifier ~= "" then
        anchor_span = make_anchor_span(cb.identifier)
    end

    --------------------------------------------------------------------
    -- 0.5. Handle :esql attribute - swap language to sql and comment out %% lines
    --------------------------------------------------------------------
    local has_esql_attr = attrs["esql"] ~= nil
    if has_esql_attr then
        -- Remove the esql attribute so it doesn't appear in output
        attrs["esql"] = nil

        -- Process the code text: comment out lines starting with %%
        -- Split by newlines manually to avoid pattern issues with %
        local lines = {}
        local text = cb.text
        local start_pos = 1
        while true do
            local newline_pos = text:find("\n", start_pos, true) -- plain search, no patterns
            local line
            if newline_pos then
                line = text:sub(start_pos, newline_pos - 1)
                start_pos = newline_pos + 1
            else
                line = text:sub(start_pos)
                if line ~= "" then
                    table.insert(lines, line)
                end
                break
            end
            -- Check if line starts with optional whitespace followed by %%
            -- We need to check for two literal % characters
            local trimmed = line:gsub("^%s*", "") -- remove leading whitespace
            if trimmed:sub(1, 2) == "%%" then
                -- Prepend -- to comment out the cell magic line
                table.insert(lines, "-- " .. line)
            else
                -- Leave single % lines and other lines as-is
                table.insert(lines, line)
            end
        end

        -- Join lines back together
        local new_text = table.concat(lines, "\n")

        -- Build fenced code block with sql language using RawBlock
        -- No % escaping needed - Pandoc doesn't interpret % in RawBlock
        local code = "```sql\n" .. new_text .. "\n```"
        local block = pandoc.RawBlock("markdown", code)

        if anchor_span then
            return { anchor_span, block }
        else
            return block
        end
    end

    --------------------------------------------------------------------
    -- 1. Handle Org "example" block depending on EXAMPLE_MODE
    --------------------------------------------------------------------
    for _, cls in ipairs(classes) do
        if cls == "example" then
            if cb.text:match("^%s*$") then
                if anchor_span then
                    return { anchor_span }
                else
                    return {}
                end
            end

            local rendered
            if EXAMPLE_MODE == "ansi" then
                rendered = render_example_ansi(cb)
            elseif EXAMPLE_MODE == "div" then
                rendered = render_example_div(cb)
            else
                -- EXAMPLE_MODE == "off": do not special-case "example",
                -- fall through to normal fenced-block handling below.
                break
            end

            if anchor_span then
                -- return both anchor and example-rendered block
                return { anchor_span, rendered }
            else
                return rendered
            end
        end
    end

    --------------------------------------------------------------------
    -- 2. Handle mdparams (inline them into fence)
    --------------------------------------------------------------------
    local raw_md = attrs["mdparams"]
    if raw_md then
        -- prevent Pandoc from serializing mdparams separately
        attrs["mdparams"] = nil
    end

    -- language = first class (if any)
    local lang = ""
    if #classes > 0 then
        lang = classes[1]
    end

    local rest = {}

    -- put mdparams first if present
    if raw_md then
        table.insert(rest, raw_md)
    end

    -- preserve all other attributes (header args, etc.)
    for k, v in pairs(attrs) do
        -- simple k=v format; adjust if you want quotes
        table.insert(rest, k .. "=" .. v)
    end

    local rest_str = ""
    if #rest > 0 then
        rest_str = " " .. table.concat(rest, " ")
    end

    local fence_line = "```" .. lang .. rest_str
    local code = fence_line .. "\n" .. cb.text .. "\n```"
    local block = pandoc.RawBlock("markdown", code)

    if anchor_span then
        return { anchor_span, block }
    else
        return block
    end
end

----------------------------------------------------------------------
-- Table handling for #+NAME anchors
----------------------------------------------------------------------

function Table(el)
    if el.identifier and el.identifier ~= "" then
        local span = make_anchor_span(el.identifier)
        -- Return a list of blocks: anchor span followed by the original table
        return { span, el }
    end
    return nil
end

----------------------------------------------------------------------
-- Org "spurious-link" spans → GFM-style internal links
----------------------------------------------------------------------

function Span(el)
    -- Only touch spans with class "spurious-link" and a "target" attribute
    local has_spurious = false
    for _, c in ipairs(el.classes) do
        if c == "spurious-link" then
            has_spurious = true
            break
        end
    end
    if not has_spurious then
        return nil
    end

    local target = el.attributes["target"]
    if not target then
        return nil
    end

    -- Unwrap a single Emph if it's the only child, so we don't get
    -- link text wrapped in extra '*' in Markdown.
    local link_text
    if #el.content == 1 and el.content[1].t == "Emph" then
        link_text = el.content[1].content
    else
        link_text = el.content
    end

    local slug = slugify_github_like(target)
    local url  = "#" .. slug

    return pandoc.Link(link_text, url)
end

----------------------------------------------------------------------
-- Export filter spec
----------------------------------------------------------------------

return {
    { RawBlock = RawBlock },
    { Meta = Meta },
    { CodeBlock = CodeBlock },
    { Table = Table },
    { Span = Span },
}
