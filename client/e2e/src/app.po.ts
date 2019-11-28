import { browser, by, element } from 'protractor';

export class AppPage {
  static navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  static getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
