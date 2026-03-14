"use client";

import { cn } from "@/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2Off,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Table2,
  Underline as UnderlineIcon,
  Undo,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Max character count. Defaults to 10000. */
  characterLimit?: number;
}

const lowlight = createLowlight(common);
const Divider = () => <div className="mx-1 h-5 w-px bg-gray-200" />;

export function RichTextEditor({
  value,
  onChange,
  characterLimit = 10000,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      // ── Core ──────────────────────────────────────────────────
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // disable built-in code block — replaced by CodeBlockLowlight
        codeBlock: false,
      }),

      // ── Text styling ──────────────────────────────────────────
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),

      // ── Alignment ─────────────────────────────────────────────
      TextAlign.configure({ types: ["heading", "paragraph"] }),

      // ── Links ─────────────────────────────────────────────────
      Link.configure({ openOnClick: false, autolink: true }),

      // ── Media ─────────────────────────────────────────────────
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),

      // ── Table ─────────────────────────────────────────────────
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,

      // ── Code ──────────────────────────────────────────────────
      CodeBlockLowlight.configure({ lowlight }),

      // ── Utilities ─────────────────────────────────────────────
      CharacterCount.configure({ limit: characterLimit }),
      Placeholder.configure({
        placeholder: "Write your blog content here…",
      }),
    ],

    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-64 px-4 py-3 focus:outline-none text-gray-700",
      },
    },
    immediatelyRender: false,
  });

  // Sync external reset (e.g. RHF reset → value === "")
  useEffect(() => {
    if (!editor) return;
    if (value === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.clearContent(true);
    }
  }, [value, editor]);

  // ── Handlers ──────────────────────────────────────────────────

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);

      // reset so the same file can be re-uploaded
      e.target.value = "";
    },
    [editor],
  );

  const handleImageUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter YouTube URL:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const handleLink = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const charCount = editor.storage.characterCount.characters();
  const wordCount = editor.storage.characterCount.words();
  const charPercent = Math.round((charCount / characterLimit) * 100);
  const nearLimit = charPercent >= 80;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-3 py-2">
        {/* History */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Inline formatting */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title={editor.isActive("link") ? "Remove link" : "Add link"}
          active={editor.isActive("link")}
          onClick={handleLink}
        >
          {editor.isActive("link") ? (
            <Link2Off className="size-3.5" />
          ) : (
            <LinkIcon className="size-3.5" />
          )}
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Media & embeds */}
        {/* Image: click opens a sub-menu via native prompt; file upload via hidden input */}
        <ToolbarButton
          title="Insert image from file"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Insert image from URL" onClick={handleImageUrl}>
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Embed YouTube video" onClick={handleYoutube}>
          <YoutubeIcon className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Table */}
        <ToolbarButton
          title="Insert table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Table2 className="size-3.5" />
        </ToolbarButton>
        {editor.isActive("table") && (
          <>
            <ToolbarButton
              title="Add column after"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <span className="text-[10px] font-medium leading-none">C+</span>
            </ToolbarButton>
            <ToolbarButton
              title="Delete column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <span className="text-[10px] font-medium leading-none">C−</span>
            </ToolbarButton>
            <ToolbarButton
              title="Add row after"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <span className="text-[10px] font-medium leading-none">R+</span>
            </ToolbarButton>
            <ToolbarButton
              title="Delete row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <span className="text-[10px] font-medium leading-none">R−</span>
            </ToolbarButton>
            <ToolbarButton
              title="Delete table"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <span className="text-[10px] font-medium leading-none text-red-500">
                Del
              </span>
            </ToolbarButton>
          </>
        )}

        <Divider />

        {/* Horizontal rule */}
        <ToolbarButton
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* ── Editor area ─────────────────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-1.5 text-xs text-gray-400">
        <span>{wordCount} words</span>
        <span className={cn(nearLimit && "text-amber-500 font-medium")}>
          {charCount.toLocaleString()} / {characterLimit.toLocaleString()}{" "}
          characters
        </span>
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

// ── ToolbarButton ────────────────────────────────────────────────

const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      "flex size-8 items-center justify-center rounded-md transition-colors",
      active
        ? "bg-[#23A4D2] text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
    )}
  >
    {children}
  </button>
);
