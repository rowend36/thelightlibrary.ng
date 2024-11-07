import knex, { Knex } from "knex";
import { getDatabase, Table, Type } from "../config/database";
import { Post } from "../data/models/post";
import { Tag } from "../data/models/tag";
import { ModelRepository } from "../utils/model_repository";
import { createRelations } from "../utils/relation_utils";

class PostRepository extends ModelRepository<"posts"> {
  constructor() {
    super("posts", "post_id", [
      "post_id",
      "user_id",
      "title",
      "slug",
      "content",
      "status",
      "published_at",
      "created_at",
      "updated_at",
    ]);
    this.hasMany({
      table: "tags",
      columns: ["tag_id", "name", "slug"],
      pk: "tag_id",
      through: "post_tags",
    });
  }
}

class PublicPostRepository extends PostRepository {
  override filter(db: Knex.QueryBuilder) {
    return super.filter(db).where("status", "published");
  }
}

const posts = new PostRepository();
const publicPosts = new PublicPostRepository();

export async function getPosts(limit = 100, offset = 0) {
  return publicPosts.list({ offset, limit });
}

export async function publishPost(post_id: number) {
  return posts.update(post_id, {
    status: "published",
    published_at: new Date(),
  });
}

export function selectPostById(post_id: number) {
  return publicPosts.select().where("posts.post_id", post_id);
}

export async function getAdminPosts(limit = 100, offset = 0) {
  return posts.list({ limit, offset });
}

export function selectAdminPostById(post_id: number) {
  return posts.select().where("posts.post_id", post_id);
}

export async function createPost({
  tags,
  ...post
}: Omit<
  Post,
  "post_id" | "created_at" | "updated_at" | "published_at" | "status" | "tags"
> &
  Partial<Pick<Post, "status">> & {
    tags?: (Partial<Tag> & Pick<Tag, "name">)[];
  }) {
  const db = getDatabase();
  return db.transaction(async (trx) => {
    const post_id = (
      await trx<Post>(Type<Table>("posts"))
        .insert({
          ...(post.status === "published"
            ? {
                published_at: new Date(),
              }
            : null),
          ...post,
        })
        .returning("post_id")
    )[0].post_id;
    if (tags) {
      await createRelations({
        from: "posts",
        to: "tags",
        item_id: post_id,
        tags,
        trx,
      });
    }
    return post_id;
  });
}

export async function updatePost(post_id: number, updates: Partial<Post>) {
  console.log(updates);
  const db = getDatabase();
  await posts.update(post_id, {
    ...(updates.status === "published"
      ? {
          published_at: db.raw("COALESCE(published_at, ?)", [
            new Date(),
          ]) as never,
        }
      : null),
    ...updates,
    updated_at: new Date(),
  });
}

export async function deletePost(post_id: number) {
  const db = getDatabase();
  return await db("posts").where({ post_id }).delete();
}

export async function getTags() {
  const db = getDatabase();
  return await db("tags").select("tag_id", "name", "slug");
}

export async function createTag(name: string, slug: string) {
  const db = getDatabase();
  const data = await db<Tag>("tags")
    .insert({
      name,
      slug,
    })
    .returning("tag_id");
  return data[0].tag_id;
}
