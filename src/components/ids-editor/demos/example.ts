import placeHolderUrl from '../../../assets/images/placeholder-154x120.png';
import IdsEditor from '../ids-editor';

const editorEl = document.querySelector<IdsEditor>('#editor-demo')!;
document.addEventListener('DOMContentLoaded', async () => {
  const modals = {
    insertimage: {
      url: placeHolderUrl,
    }
  };
  editorEl.modalElementsValue(modals);
});

document.addEventListener('DOMContentLoaded', () => {
  editorEl.value = `
  <p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce" class="hyperlink">e-commerce action-items</a>,
    reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions
    rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve
    synergistic synergies.</p><script>alert('Hello World!');</script>
  <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage
    extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge.
    Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit
    infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage
    morph.</p>`;
});
