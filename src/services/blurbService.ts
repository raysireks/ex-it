import { Blurb } from '../types';

// Stub blurbs service
class BlurbService {
  private blurbs: Blurb[] = [
    { id: '1', text: 'Every day without contact is a day of healing.', votes: 42, userId: '2', username: 'Hope123', createdAt: new Date() },
    { id: '2', text: 'I deserve someone who chooses me every day.', votes: 38, userId: '3', username: 'Strong_Mind', createdAt: new Date() },
    { id: '3', text: 'The pain is temporary, but growth is permanent.', votes: 35, userId: '4', username: 'Moving_On', createdAt: new Date() },
    { id: '4', text: 'No contact = No new pain.', votes: 31, userId: '5', username: 'Warrior22', createdAt: new Date() },
    { id: '5', text: 'They lost someone who loved them. I lost someone who didn\'t love me.', votes: 28, userId: '6', username: 'Truth_Teller', createdAt: new Date() },
    { id: '6', text: 'Breaking the cycle feels impossible until it\'s done.', votes: 25, userId: '7', username: 'Free_Bird', createdAt: new Date() },
    { id: '7', text: 'My happiness doesn\'t depend on their validation.', votes: 22, userId: '8', username: 'Self_Love', createdAt: new Date() },
    { id: '8', text: 'The urge to reach out will pass. Stay strong.', votes: 20, userId: '9', username: 'Day_by_Day', createdAt: new Date() },
    { id: '9', text: 'I\'m choosing peace over temporary comfort.', votes: 18, userId: '10', username: 'Peaceful_Path', createdAt: new Date() },
    { id: '10', text: 'Looking back keeps me stuck. Looking forward sets me free.', votes: 15, userId: '11', username: 'Forward_Focus', createdAt: new Date() },
  ];

  async getTopBlurbs(limit: number = 10): Promise<Blurb[]> {
    return Promise.resolve(
      [...this.blurbs]
        .sort((a, b) => b.votes - a.votes)
        .slice(0, limit)
    );
  }

  async voteBlurb(blurbId: string): Promise<Blurb> {
    const blurb = this.blurbs.find(b => b.id === blurbId);
    if (blurb) {
      blurb.votes++;
    }
    return Promise.resolve(blurb!);
  }

  async submitBlurb(text: string, userId: string, username: string): Promise<Blurb> {
    const newBlurb: Blurb = {
      id: Date.now().toString(),
      text,
      votes: 0,
      userId,
      username,
      createdAt: new Date(),
    };
    this.blurbs.push(newBlurb);
    return Promise.resolve(newBlurb);
  }
}

export const blurbService = new BlurbService();
