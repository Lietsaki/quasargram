import { mountQuasar } from '@quasar/quasar-app-extension-testing-unit-jest';
import {
  QLayout,
  QHeader,
  QToolbar,
  QBtn,
  QSeparator,
  QToolbarTitle,
  QPageContainer,
  QFooter,
  QTabs,
  QRouteTab
} from 'quasar';
import MainLayout from '../../../src/layouts/MainLayout';

const mountQuasarConfig = {
  mount: {
    stubs: ['router-link', 'router-view']
  },
  quasar: {
    components: {
      QLayout,
      QHeader,
      QToolbar,
      QBtn,
      QSeparator,
      QToolbarTitle,
      QPageContainer,
      QFooter,
      QTabs,
      QRouteTab
    }
  }
};

describe('Main Layout', () => {
  test('Displays title correctly', () => {
    // 1) Mount the MainLayout component
    const wrapper = mountQuasar(MainLayout, mountQuasarConfig);

    // 2) Get the element with a class of .text-grand-hotel
    const appTitle = wrapper.find('.text-grand-hotel');

    // 3) Expect such element to contain the 'Quasargram' text
    expect(appTitle.text()).toContain('Quasargram');

    // 4) Take a snapshot and expect it to match the last one
    expect(appTitle).toMatchSnapshot();
  });
});
