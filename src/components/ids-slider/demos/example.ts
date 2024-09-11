const labels = [{
  value: 0,
  text: 'very bad',
  color: 'var(--ids-color-red-100)'
}, {
  value: 20,
  text: 'poor',
  color: 'var(--ids-color-red-80)'
}, {
  value: 40,
  text: 'average',
  color: 'var(--ids-color-orange-80)'
}, {
  value: 60,
  text: 'good',
  color: 'var(--ids-color-orange-40)'
}, {
  value: 80,
  text: 'very good',
  color: 'var(--ids-color-green-60)'
}, {
  value: 100,
  text: 'excellent',
  color: 'var(--ids-color-green-90)'
}];

const getClosestLabelSettings = (targetValue: number) => labels.find((el) => targetValue <= el.value);

document.addEventListener('DOMContentLoaded', () => {
  const survey = (document as any).querySelector('.survey');
  if (survey) {
    // Set label text
    survey.labels = labels;

    // Adjust slider track/tick color when value changes
    const fixSliderColorOnChange = (e: CustomEvent) => {
      const sliderValue = e.detail.value;
      const targetLabelSettings = getClosestLabelSettings(sliderValue);
      survey.color = targetLabelSettings?.color;
    };
    survey.color = getClosestLabelSettings(survey.value)?.color;
    survey.onEvent('ids-slider-drag', survey, fixSliderColorOnChange);
    survey.onEvent('change', survey, fixSliderColorOnChange);
  }
});
