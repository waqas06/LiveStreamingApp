import { StyleSheet } from 'react-native';
import { COLOR, FAMILY, SIZE } from './typograghy';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

export default StyleSheet.create({
  contain: {
    padding: 20,
    paddingTop: 0,
    width: '100%',
  },
  textInput: {
    height: 46,
    backgroundColor: COLOR.light,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    marginTop: 20,
    marginBottom: 5,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  viewImage: {
    width: '25%',
    height: 80,
    padding: 2,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
