import { COLOR, FAMILY, SIZE } from './typograghy';

const React = require("react-native");
const { Platform } = React;

export default {
    bgCover: {
        flex: 1,
    },
    container: {
        width: '100%',
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    logo: {
        marginVertical: 20,
    },
    content: {
        width: '100%',
        backgroundColor: COLOR.light,
        elevation: 10,
        shadowOffset: {
            width: 15,
            height: 15
        },
        shadowColor: '#999',
        shadowOpacity: 0.1,
        shadowRadius: 0,
        ...Platform.select({
            ios: {
                shadowOffset: {
                    width: 5,
                    height: 5
                },
            },
        }),
    },
    inputText: {
        width: '100%',
        fontFamily: FAMILY.regular,
        fontSize: SIZE.SIZE12,
        borderBottomWidth: 1,
        borderColor: COLOR.smoke,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    btnText: {
        fontFamily: FAMILY.bold,
        fontSize: SIZE.SIZE12,
        color: COLOR.light,
    },
    forgot: {
        width: '100%',
        alignItems: 'flex-end',
        paddingVertical: 15,
    },
    forgotText: {
        fontFamily: FAMILY.regular,
        fontSize: SIZE.SIZE13,
        color: COLOR.light,
    },
    login: {
        marginVertical: 30,
        alignItems: 'center'
    },
    btnLogin: {
        justifyContent: 'center',
        padding: 10,
        textAlign: 'center',
    },
    accountText: {
        fontFamily: FAMILY.regular,
        fontSize: SIZE.SIZE14,
        color: COLOR.greyDark,
    },
    signupText: {
        fontFamily: FAMILY.bold,
        fontSize: SIZE.SIZE14,
        color: COLOR.light,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
      },
}