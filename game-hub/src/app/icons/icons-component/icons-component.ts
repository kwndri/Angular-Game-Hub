import { Component, input } from '@angular/core';
import { addIcons } from './icon-library';
import {
  FaIconLibrary,
  FaIconComponent,
} from '@fortawesome/angular-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  standalone: true,
  selector: 'app-icons',
  imports: [FaIconComponent],
  templateUrl: './icons-component.html',
  styleUrl: './icons-component.css',
})
export class IconsComponent {
  readonly iconPrefix = input<string>('fab');
  readonly iconName = input.required();
  readonly size = input<SizeProp>(
    '2x' as
      | '2xs'
      | 'xs'
      | 'sm'
      | 'lg'
      | 'xl'
      | '2xl'
      | '1x'
      | '2x'
      | '3x'
      | '4x'
      | '5x'
      | '6x'
      | '7x'
      | '8x'
      | '9x'
      | '10x'
  );
  classes = input<string>('');

  constructor(library: FaIconLibrary) {
    addIcons(library); // Use the function to add icons
  }

  get resolvedIcon(): IconProp {
    return [this.iconPrefix(), this.iconName()] as IconProp;
  }

  get resolvedSize(): SizeProp | undefined {
    return this.size() || undefined;
  }

  get resolvedClasses(): string {
    return this.classes();
  }
}
