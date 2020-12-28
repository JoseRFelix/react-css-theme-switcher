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

export function isElement(o: any) {
  return typeof HTMLElement === 'object'
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === 'object' &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === 'string';
}

export function arrayToObject(array: string[]): Record<any, string> {
  const obj: Record<any, string> = {};
  array.forEach(el => (obj[el] = el));
  return obj;
}

export function createLinkElement(attributes: Record<string, any>) {
  const linkElement = document.createElement('link');

  for (const [attribute, value] of Object.entries(attributes)) {
    if (attribute === 'onload') {
      linkElement.onload = attributes.onload;
      continue;
    }

    // @ts-ignore
    linkElement[attribute] = value;
  }

  return linkElement;
}
