export const ALIGNMENT_TYPES = ['has-icon'];

export const applyContentAlignmentClass = (cl, thisAlignment) => {
  ALIGNMENT_TYPES.forEach((alignment) => {
    if (!thisAlignment || (alignment !== thisAlignment && cl.contains(alignment))) {
      cl.remove(alignment);
    } else if (alignment === thisAlignment && !cl.contains(alignment)) {
      cl.add(alignment);
    }
  });
};
