document.addEventListener('DOMContentLoaded', () => {
  const survey = (document as any).querySelector('.survey');
  if (survey) {
    survey.labels = ['very bad', 'poor', 'average', 'good', 'excellent'];
  }
});
