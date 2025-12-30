import z from 'zod';

export const GetMod = z.object({
  data: z.object({
    id: z.number(),
    gameId: z.number(),
    name: z.string(),
    slug: z.string(),
    links: z.object({
      websiteUrl: z.string(),
      wikiUrl: z.string(),
      issuesUrl: z.string(),
      sourceUrl: z.string(),
    }),
    summary: z.string(),
    status: z.number().positive(),
    downloadCount: z.number(),
    isFeatured: z.boolean(),
    primaryCategoryId: z.number(),
    categories: z.array(
      z.object({
        id: z.number(),
        gameId: z.number(),
        name: z.string(),
        slug: z.string(),
        url: z.string(),
        iconUrl: z.string(),
        dateModified: z.iso.datetime(),
        isClass: z.boolean(),
        classId: z.number(),
        parentCategoryId: z.number(),
        displayIndex: z.number().optional(),
      }),
    ),
    classId: z.number(),
    authors: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        url: z.string(),
      }),
    ),
    logo: z.object({
      id: z.number(),
      modId: z.number(),
      title: z.string(),
      description: z.string(),
      thumbnailUrl: z.string(),
      url: z.string(),
    }),
    screenshots: z.array(
      z.object({
        id: z.number(),
        modId: z.number(),
        title: z.string(),
        description: z.string(),
        thumbnailUrl: z.string(),
        url: z.string(),
      }),
    ),
    mainFileId: z.number(),
    latestFiles: z.array(
      z.object({
        id: z.number(),
        gameId: z.number(),
        modId: z.number(),
        isAvailable: z.boolean(),
        displayName: z.string(),
        fileName: z.string(),
        releaseType: z.number().positive(),
        fileStatus: z.number().positive(),
        hashes: z.array(
          z.object({
            value: z.string(),
            algo: z.number().positive(),
          }),
        ),
        fileDate: z.iso.datetime(),
        fileLength: z.number(),
        downloadCount: z.number(),
        fileSizeOnDisk: z.number(),
        downloadUrl: z.string(),
        gameVersions: z.array(z.string()),
        sortableGameVersions: z.array(
          z.object({
            gameVersionName: z.string(),
            gameVersionPadded: z.string(),
            gameVersion: z.string(),
            gameVersionReleaseDate: z.iso.datetime(),
            gameVersionTypeId: z.number(),
          }),
        ),
        dependencies: z.array(
          z.object({
            modId: z.number(),
            relationType: z.number().positive(),
          }),
        ),
        exposeAsAlternative: z.boolean().optional(),
        parentProjectFileId: z.number().optional(),
        alternateFileId: z.number(),
        isServerPack: z.boolean(),
        serverPackFileId: z.number().optional(),
        isEarlyAccessContent: z.boolean().optional(),
        earlyAccessEndDate: z.iso.datetime().optional(),
        fileFingerprint: z.number(),
        modules: z.array(
          z.object({
            name: z.string(),
            fingerprint: z.number(),
          }),
        ),
      }),
    ),
    latestFilesIndexes: z.array(
      z.object({
        gameVersion: z.string(),
        fileId: z.number(),
        fileName: z.string().optional(),
        releaseType: z.number().positive(),
        gameVersionTypeId: z.number(),
        modLoader: z.number(),
      }),
    ),
    latestEarlyAccessFilesIndexes: z.array(
      z.object({
        gameVersion: z.string(),
        fileId: z.number(),
        fileName: z.string(),
        releaseType: z.number().positive(),
        gameVersionTypeId: z.number(),
        modLoader: z.number(),
      }),
    ),
    dateCreated: z.iso.datetime(),
    dateModified: z.iso.datetime(),
    dateReleased: z.iso.datetime(),
    allowModDistribution: z.boolean(),
    gamePopularityRank: z.number(),
    isAvailable: z.boolean(),
    thumbsUpCount: z.number(),
    rating: z.number().optional(),
  }),
});

export type GetModT = z.infer<typeof GetMod>;
