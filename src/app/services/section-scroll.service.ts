import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SectionScrollService {
  scrollToLink(link: string, event?: Event): boolean {
    const sectionId = this.getSamePageSectionId(link);

    if (!sectionId) {
      return false;
    }

    event?.preventDefault();

    const section = document.getElementById(sectionId);
    if (!section) {
      return true;
    }

    const headerOffset = 80;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth'
    });

    window.history.replaceState(null, '', `#${sectionId}`);
    return true;
  }

  private getSamePageSectionId(link: string): string | null {
    if (!link) {
      return null;
    }

    if (link.startsWith('#')) {
      return link.slice(1);
    }

    try {
      const url = new URL(link, window.location.href);
      const currentPath = window.location.pathname.replace(/\/$/, '');
      const targetPath = url.pathname.replace(/\/$/, '');

      if (url.origin === window.location.origin && targetPath === currentPath && url.hash) {
        return url.hash.slice(1);
      }
    } catch {
      return null;
    }

    return null;
  }
}
