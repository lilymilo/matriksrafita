import { createIdeaQuestStore } from './state/store.js';
import { mountIdeaQuestPage } from './components/IdeaQuestPage.js';

const appRoot = document.getElementById('app');
if (appRoot) {
  const store = createIdeaQuestStore();
  mountIdeaQuestPage(appRoot, store);
}
