import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";

class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean, readonly pos: number) {
    super();
  }

  eq(other: CheckboxWidget) {
    return other.checked === this.checked && other.pos === this.pos;
  }

  toDOM(view: EditorView) {
    const wrap = document.createElement("span");
    wrap.className = "cm-task-checkbox";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = this.checked;
    checkbox.onmousedown = (e) => {
      e.preventDefault();
      const text = this.checked ? "- [ ] " : "- [x] ";
      view.dispatch({
        changes: { from: this.pos, to: this.pos + 6, insert: text },
      });
    };
    wrap.appendChild(checkbox);
    return wrap;
  }
}

export const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      const selection = view.state.selection.main;
      const { from, to } = view.viewport;

      syntaxTree(view.state).iterate({
        from,
        to,
        enter: (node) => {
          const type = node.type.name;
          const isCursorInside = selection.from >= node.from && selection.to <= node.to;

          // Hide markdown markers when not focused
          if (!isCursorInside) {
            if (type === "HeaderMark") {
              builder.add(node.from, node.to, Decoration.mark({ class: "cm-hidden-mark" }));
            }
            if (type === "EmphasisMark" || type === "StrongMark") {
              builder.add(node.from, node.to, Decoration.mark({ class: "cm-hidden-mark" }));
            }
            if (type === "LinkMark" || type === "URL") {
              builder.add(node.from, node.to, Decoration.mark({ class: "cm-hidden-mark" }));
            }
          }

          // Task lists
          if (type === "TaskMarker") {
            const text = view.state.doc.sliceString(node.from, node.to);
            const checked = text === "[x]" || text === "[X]";
            // We replace the `- [ ]` with a checkbox widget
            // The TaskMarker is just `[ ]`. The ListMark is `-`.
            builder.add(
              node.from - 2, // Include the `- ` before it
              node.to + 1, // Include the space after it
              Decoration.replace({
                widget: new CheckboxWidget(checked, node.from - 2),
              })
            );
          }

          // Wikilinks [[note]]
          if (type === "Document") {
            // We'll use a simple regex for wikilinks since they aren't parsed by default markdown
            const text = view.state.doc.sliceString(node.from, node.to);
            const regex = /\[\[(.*?)\]\]/g;
            let match;
            while ((match = regex.exec(text)) !== null) {
              const start = node.from + match.index;
              const end = start + match[0].length;
              const isCursorInWikilink = selection.from >= start && selection.to <= end;
              
              if (!isCursorInWikilink) {
                // Hide brackets, style text
                builder.add(start, start + 2, Decoration.replace({}));
                builder.add(end - 2, end, Decoration.replace({}));
                builder.add(start + 2, end - 2, Decoration.mark({ class: "cm-wikilink" }));
              } else {
                builder.add(start, end, Decoration.mark({ class: "cm-wikilink-active" }));
              }
            }
          }
        },
      });

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
