import type { Project } from "@/db";

// Server component: shared fields for create/edit project forms.
export function ProjectFields({ project }: { project?: Project }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Titre *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={project?.title}
          placeholder="Ex. : Autoportraits — 10e année"
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="schoolYear" className="mb-1 block text-sm font-medium">
          Année scolaire
        </label>
        <input
          id="schoolYear"
          name="schoolYear"
          defaultValue={project?.schoolYear ?? ""}
          placeholder="2025-2026"
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project ? project.published : true}
        />
        Visible au public
      </label>
    </div>
  );
}
