import UserResponse from "./response/user-response";
import AlbumRequest from "./request/album-request";
import FamilyResponse from "./response/family-response";
import Person from "./model/person";

export type RootStackParamList = {
    Home: undefined;
    TreeView: undefined;
    AddMember: undefined;
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    History: undefined;
    Menu: undefined;
    Tab: undefined;
    ForgotPassword: undefined;
    ConfirmAccount: {
        email: string;
        data?: any
    };
    ResetPassword: {
        email: string;
    };
    Family: undefined;
    FamilyDetail: {
        family: FamilyResponse;
    }
    Settings: undefined;
    ChangePassword: undefined;
    Language: undefined;
    SearchUser: undefined | {
        role: 'husband' | 'wife' | 'child';
        onSelect: (user: UserResponse) => void;
    };
    FamilySelect: undefined | {
        generationIdx: number;
        onSelect: (family: FamilyResponse) => void;
    }
    FamilyCreate: undefined | {
        selectedUser?: UserResponse;
        role?: 'husband' | 'wife' | 'child';
    };
    UserProfile: {
        name: string;
    };
    SelectFamily: {
        type: 'image' | 'album' | 'profile';
    };
    ListImageView: {
        familyId: number;
    };
    ImageDetailView: {
        imageId: number;
        albumId?: number;
    };
    ImageDetailInfoView: {
        imageId: number;
    };
    SelectImageForAlbumView: {
        type: 'create_images_in_album' | 'add_images_to_album' | 'create_cover' | 'update_cover';
        familyId: number;
        albumId?: number;
        albumRequest: AlbumRequest;
    };
    ListAlbumView: {
        familyId: number;
    };
    AlbumDetailView: {
        familyId: number;
        albumId: number;
    };
    AlbumDetailInfoView: {
        albumId: number;
    };
    ListProfileView: {
        familyId: number;
    };
    ProfileDetailView: {
        profileId: number;
    };
    ProfileUpdateView: {
        profileId: number;
        isFirstLogin: boolean;
    }
    ProfileCreateView: undefined;
    ManageUser: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
    TreeCategoryScreen: undefined;
    CreateStoryScreen: undefined;
    ListStoryScreen: undefined;
    FamilyStoryDetail: {
        storyId: number;
    };
    FamilyStoryScreen: undefined;
    EditStoryScreen: {
        storyId: number;
    }
    DetailStoryScreen: {
        storyId: number;
    }
    EventScreen: undefined;
    FamilyTreeTab: undefined;
    FamilyTree: undefined;
    FamilyTreeCreate: undefined;
    FamilyTreeDetailTab: {
        familyTreeId: number;
    };
    FamilyTreeEdit: {
        familyTreeId: number;
    }
    FamilyTreeInfo: {
        familyTreeId: number;
    }
    SuggestUser: undefined
    FamilyStats: {
        persons: Person[];
    }
};
