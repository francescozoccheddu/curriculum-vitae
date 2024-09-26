import { setupPager } from './utils/pager';
import { setupSkillsWords } from './utils/skillsWords';

setupPager();
void document.fonts.ready.then(() => {
  setupSkillsWords();
});