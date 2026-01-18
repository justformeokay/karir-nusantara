import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, Zap, Wifi } from 'lucide-react';
import { Job, formatSalaryRange, getTimeAgo } from '@/data/jobs';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  job: Job;
  index?: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/lowongan/${job.id}`}>
        <div className="group bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 hover:border-primary/30">
          <div className="flex gap-4">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-14 h-14 rounded-xl object-cover bg-muted"
              />
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                </div>
                {job.isUrgent && (
                  <Badge variant="destructive" className="flex-shrink-0 gap-1">
                    <Zap className="w-3 h-3" />
                    Urgent
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {job.jobType}
                </span>
                {job.isRemote && (
                  <span className="flex items-center gap-1.5 text-success">
                    <Wifi className="w-4 h-4" />
                    Remote
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <span className="font-semibold text-primary">
                  {formatSalaryRange(job.salaryMin, job.salaryMax)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {getTimeAgo(job.postedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;
