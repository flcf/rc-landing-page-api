import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

interface TeamMember {
    name: string;
    photo: string;
    position: string;
    description: string;
}

class TeamService {
    private collectionName = 'teamMembers';

    async getTeamMembers(): Promise<TeamMember[]> {
        const snapshot = await firestore.collection(this.collectionName).get();
        const teamMembers: TeamMember[] = [];

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

export default new TeamService();