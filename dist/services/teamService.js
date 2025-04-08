"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const firestore = new firestore_1.Firestore();
class TeamService {
    constructor() {
        this.collectionName = 'teamMembers';
    }
    async getTeamMembers() {
        const snapshot = await firestore.collection(this.collectionName).get();
        const teamMembers = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            teamMembers.push({
                name: data.name,
                photo: data.photo,
                position: data.position,
                description: data.description,
            });
        });
        return teamMembers;
    }
}
exports.default = new TeamService();
