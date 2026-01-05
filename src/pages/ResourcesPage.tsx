import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { ResourceModule } from '../types';

const ResourcesPage: React.FC = () => {
  const [modules, setModules] = useState<ResourceModule[]>([]);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const data = await resourceService.getModules();
    setModules(data);
  };

  const handleModuleClick = (module: ResourceModule) => {
    alert(`${module.title}\n\n${module.content}\n\n(Full module content coming soon)`);
  };

  return (
    <div className="resources-page">
      <div className="page-content">
        <h1>Recovery Resources</h1>
        <div className="resources-list">
          {modules.map((module) => (
            <div
              key={module.id}
              className="resource-module"
              onClick={() => handleModuleClick(module)}
            >
              <h3>{module.title}</h3>
              <p className="description">{module.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
