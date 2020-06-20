export function isBrowser() {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  );
}

export function findCommentNode(comment: string) {
  const head = document.head;
  for (let i = 0; i < head.childNodes.length; i++) {
    const node = head.childNodes[i];
    if (node.nodeType === 8 && node?.nodeValue?.trim() === comment) {
      return node;
    }
  }
  return null;
}

export function arrayToObject(array: string[]): Record<any, string> {
  const obj: Record<any, string> = {};
  array.forEach(el => (obj[el] = el));
  return obj;
}

export const noop = () => {};
