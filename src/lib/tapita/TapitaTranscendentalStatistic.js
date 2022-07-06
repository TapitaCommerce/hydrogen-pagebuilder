export class TapitaTranscendentalStatistic {
  static pageNamespace = "tapitaPageHint";
  static catalogNamespace = "tapitaCatalogHint";
  static savedNamespace = "saved";

  static extractAnalytics(jsonSource) {
    const pages = jsonSource?.data?.spb_page?.items ?? [];
    const catalogs = jsonSource?.data?.catalog_builder_page?.items ?? [];
    const availablePageURLs = pages.map(p => p.url_path);
    const catalogHints = catalogs.map(c => {
      return {
        apply_to: c.apply_to,
        url_path: c.url_path
      };
    });

    return {
      [this.pageNamespace]: availablePageURLs,
      [this.catalogNamespace]: catalogHints
    };
  };

  static checkSavedAnalytics() {
    if (localStorage) {
      const sB = localStorage.getItem(this.savedNamespace);
      if (!sB) {
        return false;
      }
      const savedTime = sB.time;
      const staleDuration = 5 * 60 * 1000;
      if (sB.time + staleDuration < Date.now()) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  static getCode(url_path) {
    return `tapita_is${encodeURIComponent(url_path)}`.replaceAll("%", "_");
  }

  static saveAnalytics(analyticBlock, saveCallback) {
    if (!analyticBlock) {
      return;
    }
    const url_path = `${analyticBlock.apply_to ?? ""}/${analyticBlock.url_path ?? ""}`;
    saveCallback(this.getCode(url_path), true);
  }

  static getPageAnalyticBlock(props, url_path = null, optimistic = true) {
    const encodedPath = this.getCode(url_path);
    return props ? (props[encodedPath] ?? optimistic) : false;
  }

  static hasPageHint(pageAnalyticBlock, url_path) {
    return pageAnalyticBlock && !!pageAnalyticBlock.find(p => p === url_path);
  }
}
