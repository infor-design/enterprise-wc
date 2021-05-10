const idsText = window.document.querySelectorAll('ids-text')
const idsRating = window.document.querySelectorAll('ids-rating')

idsRating[0].addEventListener('click', () => {
  const rating0Value = idsRating[0].getAttribute('value')
  const updatedValue = `${rating0Value} out of 5 stars selected.`
  idsText[2].innerHTML = updatedValue
})