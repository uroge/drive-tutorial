import { eq } from "drizzle-orm";
import DriveContents from "~/app/drive-contents";
import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";

const getAllParents = async (folderId: number) => {
  const parents = [];
  let currentId: number | null = folderId;

  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, currentId));

    if (!folder[0]) {
      throw new Error("Folder not found");
    }

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent;
  }

  return parents;
};

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const filesPromise = db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));

  const foldersPromise = db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);

  const [files, folders, parents] = await Promise.all([
    filesPromise,
    foldersPromise,
    parentsPromise,
  ]);

  return (
    <DriveContents
      files={files ?? []}
      folders={folders ?? []}
      parents={parents}
    />
  );
}
