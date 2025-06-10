import { db } from "~/server/db";
import { mockFolders } from "~/lib/mock-data";
import { files_table, folders_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function page() {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not found");
  }

  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, user.userId));

  return (
    <div className="flex flex-col gap-4">
      Seed funciton
      {folders.map((folder) => {
        return <p key={folder.id}>{folder.name}</p>;
      })}
      <form
        action={async () => {
          "use server";

          // eslint-disable-next-line drizzle/enforce-delete-with-where
          await db.delete(folders_table);
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          await db.delete(files_table);

          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "root",
              ownerId: user.userId,
              parent: null,
            })
            .$returningId();

          const insertFoldersPromise = db.insert(folders_table).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              parent: rootFolder[0]!.id,
              ownerId: user.userId,
              createdAt: new Date(),
            })),
          );
          // const insertFilesPromise = db.insert(files_table).values(
          //   mockFiles.map((file, index) => ({
          //     id: index + 1,
          //     name: file.name,
          //     size: 5000,
          //     url: file.url,
          //     parent: (index % 3) + 1,
          //     ownerId: user.userId ?? "",
          //     createdAt: new Date(),
          //   })),
          // );

          await Promise.all([
            // insertFilesPromise,
            insertFoldersPromise,
          ]);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
