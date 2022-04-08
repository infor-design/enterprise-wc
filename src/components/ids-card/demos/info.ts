import '../ids-card';
import '../ids-card-action';
import '../../ids-image/ids-image';
import '../../ids-menu-button/ids-menu-button';
import '../../ids-popup-menu/ids-popup-menu';
import '../../ids-popup/ids-popup';
import '../../ids-menu/ids-menu-item';
import '../../ids-menu/ids-menu-group';
import avatarPlaceholder from '../../../assets/images/10.jpg';

document.querySelectorAll('ids-image').forEach((image: any) => {
  image.src = avatarPlaceholder;
});
