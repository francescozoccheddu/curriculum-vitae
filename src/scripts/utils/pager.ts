function getOffset(event: KeyboardEvent): number {
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return 0;
  }
  switch (event.key) {
    case 'ArrowLeft':
      return -1;
    case 'ArrowRight':
      return 1;
  }
  return 0;
}

declare const __page__: number;
declare const __pages__: readonly string[];

function changePage(offset: number): boolean {
  if (offset !== 0) {
    const i = __page__ + offset;
    if (i >= 0 && i < __pages__.length) {
      window.location.replace(__pages__[i]!);
      return true;
    }
  }
  return false;
}

export function setupPager(): void {
  window.addEventListener('keyup', e => {
    if (changePage(getOffset(e))) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    return false;
  });
}