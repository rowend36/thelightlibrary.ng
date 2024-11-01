import { Knex } from "knex";
import { db, JoinColumn, Selection, Table, Type } from "../config/database";
import { Post } from "../data/models/post";
import { Tag } from "../data/models/tag";
import { ModelService } from "../utils/model_service";
import { createRelations } from "../utils/relation_utils";
import reshape from "../utils/reshape";

class PostService extends ModelService<"posts"> {
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

class PublicPostService extends PostService {
  override select() {
    return super.select().where("published", true);
  }
}

const postService = new PostService();
const publicPostService = new PublicPostService();

export async function getPosts(limit = 100, offset = 0) {
  return publicPostService.list({ offset, limit });
}

export async function publishPost(post_id: number) {
  return postService.update(post_id, {
    status: "published",
    published_at: new Date(),
  });
}

export function selectPostById(post_id: number) {
  return publicPostService.retrieve(post_id);
}

export async function getAdminPosts(limit = 100, offset = 0) {
  return postService.list({ limit, offset });
}

export function selectAdminPostById(post_id: number) {
  return postService.retrieve(post_id);
}

export async function createPost({
  tags,
  ...post
}:
  | Omit<
      Post,
      | "post_id"
      | "created_at"
      | "updated_at"
      | "published_at"
      | "status"
      | "tags"
    > &
      Partial<Pick<Post, "status">> & {
        tags?: (Partial<Tag> & Pick<Tag, "name">)[];
      }) {
  return db.transaction(async (trx) => {
    const post_id = (
      await trx<Post>(Type<Table>("posts")).insert(post).returning("post_id")
    )[0].post_id;
    if (tags) {
      createRelations({
        from: "posts",
        to: "tags",
        id: "post_id",
        tags,
        trx,
      });
    }
    return post_id;
  });
}

export async function updatePost(post_id: number, updates: Partial<Post>) {
  return postService.update(post_id, {
    ...updates,
    updated_at: new Date(),
  });
}

export async function deletePost(post_id: number) {
  return await db("posts").where({ post_id }).delete();
}

export async function getTags() {
  return await db("tags").select("tag_id", "name", "slug");
}

export async function createTag(name: string, slug: string) {
  const data = await db<Tag>("tags")
    .insert({
      name,
      slug,
    })
    .returning("tag_id");
  return data[0].tag_id;
}
