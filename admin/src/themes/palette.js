// // material-ui
// import { createTheme } from '@mui/material/styles';
//
// // third-party
// import { presetPalettes } from '@ant-design/colors';
//
// // project import
// import ThemeOption from './theme';
//
// // ==============================|| DEFAULT THEME - PALETTE ||============================== //
//
// export default function Palette(mode, presetColor) {
//   const colors = presetPalettes;
//
//   let greyPrimary = [
//     '#ffffff',
//     '#fafafa',
//     '#f5f5f5',
//     '#f0f0f0',
//     '#d9d9d9',
//     '#bfbfbf',
//     '#8c8c8c',
//     '#595959',
//     '#262626',
//     '#141414',
//     '#000000'
//   ];
//   let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
//   let greyConstant = ['#fafafb', '#e6ebf1'];
//
//   colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];
//
//   const paletteColor = ThemeOption(colors, presetColor, mode);
//
//   return createTheme({
//     palette: {
//       mode,
//       common: {
//         black: '#000',
//         white: '#fff'
//       },
//       ...paletteColor,
//       text: {
//         primary: paletteColor.grey[700],
//         secondary: paletteColor.grey[500],
//         disabled: paletteColor.grey[400]
//       },
//       action: {
//         disabled: paletteColor.grey[300]
//       },
//       divider: paletteColor.grey[200],
//       background: {
//         paper: paletteColor.grey[0],
//         default: paletteColor.grey.A50
//       }
//     }
//   });
// }
// material-ui

import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = { ...presetPalettes }; // Spread to keep original colors intact

  // Define custom grey colors (optional, you can skip if unchanged)
  let greyPrimary = [
    '#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9', '#bfbfbf',
    '#8c8c8c', '#595959', '#262626', '#141414', '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  // Update the `grey` array in `colors`
  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  // Replace the blue colors with lavender shades
  colors.blue[0] = '#f3e5f5'; // Lightest lavender
  colors.blue[1] = '#e1bee7'; // Light lavender
  colors.blue[2] = '#ce93d8'; // Slightly darker lavender
  colors.blue[3] = '#ba68c8'; // Main lavender
  colors.blue[4] = '#ab47bc'; // Lavender with a slight pinkish hue
  colors.blue[5] = '#9c27b0'; // Main lavender (darker)
  colors.blue[6] = '#8e24aa'; // Darker lavender
  colors.blue[7] = '#7b1fa2'; // More intense lavender
  colors.blue[8] = '#6a1b9a'; // Darker lavender
  colors.blue[9] = '#4a148c'; // Deepest lavender

  const paletteColor = ThemeOption(colors, presetColor, mode);

  return createTheme({
    palette: {
      mode, // Automatically sets light or dark mode
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      text: {
        primary: mode === 'dark' ? paletteColor.grey[200] : paletteColor.grey[700],
        secondary: mode === 'dark' ? paletteColor.grey[300] : paletteColor.grey[500],
        disabled: mode === 'dark' ? paletteColor.grey[500] : paletteColor.grey[400]
      },
      action: {
        disabled: mode === 'dark' ? paletteColor.grey[600] : paletteColor.grey[300]
      },
      divider: mode === 'dark' ? paletteColor.grey[800] : paletteColor.grey[200],
      background: {
        paper: mode === 'dark' ? paletteColor.grey[900] : paletteColor.grey[0],
        default: mode === 'dark' ? paletteColor.grey[900] : paletteColor.grey.A50
      }
    }
  });
}
