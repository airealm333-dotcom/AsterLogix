"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useReducer } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const toolbarBtn =
  "rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40";
const toolbarBtnOn = "bg-primary/20 border-primary/40 text-foreground";

export default function TiptapEditor({ value, onChange }: Props) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[320px] focus:outline-none px-4 py-3 text-foreground [&_a]:text-primary [&_a]:underline",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const fn = () => bump();
    editor.on("transaction", fn);
    return () => {
      editor.off("transaction", fn);
    };
  }, [editor, bump]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (https://…)", prev ?? "https://");
    if (url === null) return;
    const t = url.trim();
    if (t === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const withScheme =
      /^https?:\/\//i.test(t) || t.startsWith("mailto:") ? t : `https://${t}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: withScheme }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-[280px] rounded-xl border border-border bg-white animate-pulse" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="flex flex-wrap gap-1.5 border-b border-border bg-surface px-3 py-2">
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("bold") ? toolbarBtnOn : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("italic") ? toolbarBtnOn : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("heading", { level: 2 }) ? toolbarBtnOn : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("heading", { level: 3 }) ? toolbarBtnOn : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("bulletList") ? toolbarBtnOn : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </button>
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("orderedList") ? toolbarBtnOn : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbers
        </button>
        <button
          type="button"
          className={`${toolbarBtn} bg-white ${editor.isActive("blockquote") ? toolbarBtnOn : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button type="button" className={`${toolbarBtn} bg-white`} onClick={setLink}>
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
