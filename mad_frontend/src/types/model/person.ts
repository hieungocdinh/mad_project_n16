export default interface Person {
    id: number;
    name: string;
    avatarUrl: string;
    generation: number;
    spouseId?: number;
    parentId?: number;
    childrenIds: number[];

}