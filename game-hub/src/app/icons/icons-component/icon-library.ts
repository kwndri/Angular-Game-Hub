// src/app/icon-library.ts
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faFacebook,
  faYoutube,
  faInstagram,
  faTwitter,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import {
  faBriefcase,
  faLocationDot,
  faArrowRight,
  faCheck,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export function addIcons(library: FaIconLibrary) {
  library.addIcons(
    faGithub,
    faFacebook,
    faYoutube,
    faInstagram,
    faTwitter,
    faBriefcase,
    faLocationDot,
    faBookmark,
    faArrowRight,
    faPlus,
    faMinus,
    faCheck,
    faChevronDown,
    faArrowLeft
  );
}
