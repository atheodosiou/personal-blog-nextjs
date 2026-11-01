import { posts } from "#site/content";
import { sortPosts } from "@/lib/utils";

export const POSTS_PER_PAGE = 5;

export function getPublishedPosts() {
  return sortPosts(posts.filter((post) => post.published));
}

export function getBlogPagination(page?: string | string[]) {
  const published = getPublishedPosts();
  const totalPages = Math.max(1, Math.ceil(published.length / POSTS_PER_PAGE));
  const requestedPage = Number(Array.isArray(page) ? page[0] : page);
  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(totalPages, Math.max(1, requestedPage))
    : 1;
  return {
    published,
    totalPages,
    currentPage,
    path: currentPage === 1 ? "/blog" : `/blog?page=${currentPage}`,
    displayPosts: published.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE,
    ),
  };
}
