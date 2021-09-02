# TODO for IDS Draggable

- [] consider mobile touch
- documentation: ids-drag event: e.detail.parentRect, e.detail.dragDeltaX/Y, e.detail.translateX/Y
- known issue (minor): in firefox, the cursor when moved quickly flashes between dragging/default as the positioning/detection
isnt instant as it is in chrome.
- parentContainment => change to containment="parent"/optional enum
- add containment=".domselector" (and syntax)