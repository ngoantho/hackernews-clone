async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
  });

  const count = await context.prisma.link.count({ where });

  return {
    links,
    count,
  };
}

module.exports = {
  feed,
};
