import { ResourceModule } from '../types';

// Stub resources service
class ResourceService {
  private modules: ResourceModule[] = [
    {
      id: '1',
      title: 'Understanding No Contact',
      description: 'Learn why no contact is essential for healing',
      content: 'No contact allows you to break the emotional cycle and begin healing...',
    },
    {
      id: '2',
      title: 'Coping with Urges',
      description: 'Strategies to resist the urge to reach out',
      content: 'When you feel the urge to contact your ex, try these techniques...',
    },
    {
      id: '3',
      title: 'Building Self-Worth',
      description: 'Rebuilding confidence after a breakup',
      content: 'Your worth is not defined by whether someone chose to stay or leave...',
    },
    {
      id: '4',
      title: 'Creating New Routines',
      description: 'Establishing healthy habits and patterns',
      content: 'Breaking old patterns starts with creating new, positive routines...',
    },
  ];

  async getModules(): Promise<ResourceModule[]> {
    return Promise.resolve(this.modules);
  }

  async getModule(id: string): Promise<ResourceModule | undefined> {
    return Promise.resolve(this.modules.find(m => m.id === id));
  }
}

export const resourceService = new ResourceService();
