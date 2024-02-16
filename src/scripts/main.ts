import { setupPager } from './utils/pager';
import { setupSkillsWords } from './utils/skillsWords';
import { setupToday } from './utils/today';

setupToday();
setupPager();
void document.fonts.ready.then(() => {
  setupSkillsWords();
});