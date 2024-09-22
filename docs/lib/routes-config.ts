// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      // {
      //   title: "Installation",
      //   href: "/installation",
      //   items: [
      //     { title: "Laravel", href: "/laravel" },
      //     { title: "React", href: "/react" },
      //     { title: "Gatsby", href: "/gatsby" },
      //     { title: "Test", href: "/test" },
      //   ],
      // },
    ],
  },
  {
    title: "Contributions",
    href: "/contributions",
    noLink: true,
    items: [
      { title: "Contributing to Documentation", href: "/documentation" }, //What happend here why does this work ? 
    ],
  },

];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
