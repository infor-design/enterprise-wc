# Ids Rating

## Allows for the display or selection of an objects rating.

## Usage
The rating component displays a scale of selectable values in ascending order. A user can select a rating by clicking the star with the position that corresponds to the users rating out of the total. Best for showing a user's current selection relative to the lower and upper limits of a scale.

```html
<ids-rating></ids-rating>
```

## Default settings
```html
<ids-rating stars="5" readonly="false" value="0" size="large"></ids-rating>
```

![Variants Image](https://ids-com.s3.amazonaws.com/documents/rating_index.svg)

## Variants
The rating component can be used as an interactive or read only element. Users may select any whole value out of the total as a rating. When functioning as a read-only element, ratings may use .5 decimals to more accurately display the average rating of an object.

```html
<ids-rating stars="5" readonly="true" value="4.5" size="large"></ids-rating>
```

![Variants Image](https://ids-com.s3.amazonaws.com/documents/rating_variant.svg)