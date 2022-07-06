const blogPattern = /^\/blogs\/([\w-]+)\/([\w-]+)$/;

export const resolveBlog = (pathname = '') => {
  const matchResult = pathname.match(blogPattern);
  if (matchResult?.length === 3) {
    return {
      blogHandle: matchResult[1],
      articleHandle: matchResult[2],
    };
  } else {
    return null;
  }
};
