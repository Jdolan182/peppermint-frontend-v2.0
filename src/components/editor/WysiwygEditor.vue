<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">

    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">

      <button type="button" title="Bold"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleBold().run()">
        <span class="font-bold text-sm leading-none">B</span>
      </button>

      <button type="button" title="Italic"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleItalic().run()">
        <span class="italic text-sm leading-none">I</span>
      </button>

      <button type="button" title="Strikethrough"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleStrike().run()">
        <span class="line-through text-sm leading-none">S</span>
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button type="button" title="Heading 1"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        <span class="text-xs font-bold leading-none">H1</span>
      </button>

      <button type="button" title="Heading 2"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        <span class="text-xs font-bold leading-none">H2</span>
      </button>

      <button type="button" title="Heading 3"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        <span class="text-xs font-bold leading-none">H3</span>
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button type="button" title="Bullet list"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleBulletList().run()">
        <ListBulletIcon class="w-4 h-4" />
      </button>

      <button type="button" title="Ordered list"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleOrderedList().run()">
        <Bars3BottomLeftIcon class="w-4 h-4" />
      </button>

      <button type="button" title="Blockquote"
        class="p-1.5 rounded transition-colors"
        :class="editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        @click="editor.chain().focus().toggleBlockquote().run()">
        <ChatBubbleLeftIcon class="w-4 h-4" />
      </button>

      <button type="button" title="Horizontal rule"
        class="p-1.5 rounded transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        @click="editor.chain().focus().setHorizontalRule().run()">
        <MinusIcon class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button type="button" title="Undo"
        class="p-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="editor.can().undo() ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' : 'text-gray-300 dark:text-gray-600'"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()">
        <ArrowUturnLeftIcon class="w-4 h-4" />
      </button>

      <button type="button" title="Redo"
        class="p-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="editor.can().redo() ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' : 'text-gray-300 dark:text-gray-600'"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()">
        <ArrowUturnRightIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Content area -->
    <div class="bg-white dark:bg-gray-900 px-4 py-3 min-h-64">
      <EditorContent :editor="editor" class="wysiwyg" />
    </div>

  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { watch, onBeforeUnmount } from 'vue'
import {
  ListBulletIcon,
  Bars3BottomLeftIcon,
  ChatBubbleLeftIcon,
  MinusIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Write your content here...' },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: { class: 'wysiwyg-editor outline-none' },
  },
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
/* Placeholder */
.wysiwyg :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}

/* Editor base */
.wysiwyg :deep(.ProseMirror) {
  min-height: 14rem;
  outline: none;
  color: inherit;
  line-height: 1.7;
}

/* Headings */
.wysiwyg :deep(.ProseMirror h1) { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.wysiwyg :deep(.ProseMirror h2) { font-size: 1.375rem; font-weight: 600; margin: 1rem 0 0.5rem; }
.wysiwyg :deep(.ProseMirror h3) { font-size: 1.125rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

/* Paragraphs */
.wysiwyg :deep(.ProseMirror p) { margin-bottom: 0.75rem; }

/* Lists */
.wysiwyg :deep(.ProseMirror ul) { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.wysiwyg :deep(.ProseMirror ol) { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.wysiwyg :deep(.ProseMirror li) { margin-bottom: 0.25rem; }

/* Blockquote */
.wysiwyg :deep(.ProseMirror blockquote) {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #6b7280;
}

/* HR */
.wysiwyg :deep(.ProseMirror hr) { border-top: 1px solid #e5e7eb; margin: 1rem 0; }

/* Strong / em */
.wysiwyg :deep(.ProseMirror strong) { font-weight: 700; }
.wysiwyg :deep(.ProseMirror em) { font-style: italic; }
.wysiwyg :deep(.ProseMirror s) { text-decoration: line-through; }
</style>
