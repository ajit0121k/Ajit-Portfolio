import initialDump from "../constants/initialDbDump.json";

const STORAGE_KEYS = {
  PROFILE: "portfolio_cms_profile",
  PROJECTS: "portfolio_cms_projects",
  SKILLS: "portfolio_cms_skills",
  EXPERIENCE: "portfolio_cms_experience",
  EDUCATION: "portfolio_cms_education",
  CERTIFICATIONS: "portfolio_cms_certifications",
  TESTIMONIALS: "portfolio_cms_testimonials",
  MESSAGES: "portfolio_cms_messages",
  MEDIA: "portfolio_cms_media",
  SETTINGS: "portfolio_cms_settings",
  SEO: "portfolio_cms_seo",
  BLOG: "portfolio_cms_blog",
  RESUME: "portfolio_cms_resume",
  ACTIVITY: "portfolio_cms_activity",
  VERSION: "portfolio_cms_dump_version",
};

const CURRENT_VERSION = "2026_09_13_v6";

function getStorage(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

export function initLocalData() {
  if (typeof window === "undefined") return;
  const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
  const shouldReset = storedVersion !== CURRENT_VERSION;

  if (shouldReset || !localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    const prof = initialDump.profiles?.[0] || {};
    setStorage(STORAGE_KEYS.PROFILE, prof);
    setStorage(STORAGE_KEYS.PROJECTS, initialDump.projects || []);
    setStorage(STORAGE_KEYS.SKILLS, initialDump.skills || []);
    setStorage(STORAGE_KEYS.EXPERIENCE, initialDump.experiences || []);
    setStorage(STORAGE_KEYS.EDUCATION, initialDump.educations || []);
    setStorage(STORAGE_KEYS.CERTIFICATIONS, initialDump.certifications || []);
    setStorage(STORAGE_KEYS.SETTINGS, initialDump.sitesettings?.[0] || {});
    setStorage(STORAGE_KEYS.RESUME, initialDump.resumes || []);
    setStorage(STORAGE_KEYS.MEDIA, initialDump.media || []);
    setStorage(STORAGE_KEYS.ACTIVITY, initialDump.activitylogs || []);
    setStorage(STORAGE_KEYS.TESTIMONIALS, initialDump.testimonials || []);
    setStorage(STORAGE_KEYS.MESSAGES, initialDump.messages || []);
    setStorage(STORAGE_KEYS.BLOG, initialDump.blogposts || []);
    setStorage(STORAGE_KEYS.SEO, prof.seo || {
      title: "Ajit Kumar | Full Stack MERN Developer & AI Engineer",
      description: "Portfolio of Ajit Kumar - Full Stack MERN Developer skilled in React, Node.js, Express, MongoDB, and Generative AI.",
      keywords: ["Ajit Kumar", "MERN Stack Developer", "React.js", "Node.js", "Generative AI"],
      ogImage: "/profile.jpg",
      twitterHandle: "@ajit0121k",
      canonicalUrl: "https://ajit0121k.github.io/Ajit-Portfolio/",
      robots: "index, follow"
    });
    setStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  }
}

// Auto-initialize on import
initLocalData();

export function handleLocalRequest(method, url, data) {
  initLocalData();
  const upperMethod = (method || "GET").toUpperCase();
  const cleanUrl = (url || "").replace(/^https?:\/\/[^/]+/, "").replace(/^\/api/, "") || "/";
  const [pathOnly, queryStr] = cleanUrl.split("?");
  const pathParts = pathOnly.split("/").filter(Boolean);
  const resource = pathParts[0] || "";
  const subOrId = pathParts[1] || "";
  const action = pathParts[2] || "";

  // Parse data
  let body = data;
  if (typeof data === "string") {
    try {
      body = JSON.parse(data);
    } catch (e) {
      body = data;
    }
  }

  // 1. AUTH
  if (resource === "auth") {
    if (subOrId === "login" && upperMethod === "POST") {
      const email = (body?.email || "").trim().toLowerCase();
      const pass = (body?.password || "").trim();
      const isAuth =
        (email === "ajitkumar2956654@gmail.com" || email === "ajitkumar@gmail.com" || email === "7379247197") &&
        pass === "Ajit@1234";

      if (isAuth) {
        const adminData = {
          id: "admin_master_primary",
          username: "ajitkumar",
          email: "ajitkumar2956654@gmail.com",
          mobile: "7379247197",
          role: "superadmin",
          isActive: true
        };
        return {
          success: true,
          message: "Login successful",
          data: {
            admin: adminData,
            accessToken: "local_auth_jwt_" + Date.now()
          }
        };
      }
      return null;
    }

    if (subOrId === "me" && upperMethod === "GET") {
      return {
        success: true,
        data: {
          admin: {
            id: "admin_master_primary",
            username: "ajitkumar",
            email: "ajitkumar2956654@gmail.com",
            mobile: "7379247197",
            role: "superadmin",
            isActive: true
          }
        }
      };
    }

    if (subOrId === "logout") {
      return { success: true, message: "Logout successful" };
    }
  }

  // 2. PROFILE
  if (resource === "profile") {
    let profile = getStorage(STORAGE_KEYS.PROFILE, initialDump.profiles[0] || {});
    if (upperMethod === "GET") {
      if (subOrId === "completeness") {
        let score = 0;
        if (profile.name) score += 10;
        if (profile.title) score += 10;
        if (profile.bio) score += 15;
        if (profile.profileImage?.url || profile.avatar) score += 15;
        if (profile.location) score += 10;
        if (profile.email) score += 10;
        if (profile.phone) score += 5;
        if (profile.resume?.url || profile.resumeUrl) score += 15;
        if (profile.socialLinks?.github || profile.socialLinks?.linkedin) score += 10;
        return { success: true, data: { completeness: Math.min(score, 100) } };
      }
      return { success: true, data: profile };
    }
    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      profile = { ...profile, ...body, updatedAt: new Date().toISOString() };
      setStorage(STORAGE_KEYS.PROFILE, profile);
      return { success: true, message: "Profile updated successfully", data: profile };
    }
  }

  // 3. SETTINGS
  if (resource === "settings") {
    let settings = getStorage(STORAGE_KEYS.SETTINGS, initialDump.sitesettings?.[0] || {});
    if (upperMethod === "GET") {
      // Both /settings and /settings/public return same data locally
      return { success: true, data: settings };
    }
    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      settings = { ...settings, ...body, updatedAt: new Date().toISOString() };
      setStorage(STORAGE_KEYS.SETTINGS, settings);
      return { success: true, message: "Settings updated successfully", data: settings };
    }
  }

  // 4. PROJECTS
  if (resource === "projects") {
    let projects = getStorage(STORAGE_KEYS.PROJECTS, initialDump.projects || []);

    if (upperMethod === "GET") {
      if (subOrId === "published") {
        const pub = projects.filter(p => p.status === "published" || p.status === undefined);
        return {
          success: true,
          data: {
            projects: pub,
            total: pub.length,
            page: 1,
            totalPages: 1
          }
        };
      }
      // Handle /projects/slug/:slug and /projects/slug/:slug/related
      if (subOrId === "slug" && action) {
        const extraAction = pathParts[3] || "";
        const found = projects.find(p => p.slug === action);
        if (extraAction === "related") {
          const related = projects.filter(p => p.slug !== action && (p.status === "published" || p.status === undefined)).slice(0, 3);
          return { success: true, data: related };
        }
        return { success: true, data: found || projects[0] };
      }
      if (subOrId) {
        const found = projects.find(p => p._id === subOrId || p.id === subOrId || p.slug === subOrId);
        return { success: true, data: found || projects[0] };
      }
      return {
        success: true,
        data: {
          projects: projects,
          total: projects.length,
          page: 1,
          totalPages: 1
        }
      };
    }

    if (upperMethod === "POST") {
      if (action === "duplicate") {
        const orig = projects.find(p => p._id === subOrId || p.id === subOrId) || projects[0];
        const copy = {
          ...orig,
          _id: "proj_" + Date.now(),
          id: "proj_" + Date.now(),
          title: orig.title + " (Copy)",
          slug: (orig.slug || "proj") + "-copy-" + Date.now().toString().slice(-4),
          createdAt: new Date().toISOString()
        };
        projects.unshift(copy);
        setStorage(STORAGE_KEYS.PROJECTS, projects);
        return { success: true, message: "Project duplicated", data: copy };
      }

      const newProj = {
        _id: "proj_" + Date.now(),
        id: "proj_" + Date.now(),
        order: projects.length + 1,
        status: "published",
        ...body,
        slug: body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "project-" + Date.now()),
        createdAt: new Date().toISOString()
      };
      projects.unshift(newProj);
      setStorage(STORAGE_KEYS.PROJECTS, projects);
      return { success: true, message: "Project created successfully", data: newProj };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      if (subOrId === "reorder") {
        if (Array.isArray(body?.items)) {
          body.items.forEach(item => {
            const p = projects.find(x => x._id === item.id || x.id === item.id);
            if (p) p.order = item.order;
          });
          projects.sort((a, b) => (a.order || 0) - (b.order || 0));
          setStorage(STORAGE_KEYS.PROJECTS, projects);
        }
        return { success: true, message: "Reordered successfully" };
      }

      projects = projects.map(p => (p._id === subOrId || p.id === subOrId ? { ...p, ...body, updatedAt: new Date().toISOString() } : p));
      setStorage(STORAGE_KEYS.PROJECTS, projects);
      const updated = projects.find(p => p._id === subOrId || p.id === subOrId) || projects[0];
      return { success: true, message: "Project updated successfully", data: updated };
    }

    if (upperMethod === "DELETE") {
      projects = projects.filter(p => p._id !== subOrId && p.id !== subOrId);
      setStorage(STORAGE_KEYS.PROJECTS, projects);
      return { success: true, message: "Project deleted successfully" };
    }
  }

  // 5. SKILLS
  if (resource === "skills") {
    let skills = getStorage(STORAGE_KEYS.SKILLS, initialDump.skills || []);

    if (upperMethod === "GET") {
      if (subOrId === "visible") {
        return { success: true, data: skills.filter(s => s.visible !== false) };
      }
      return { success: true, data: skills };
    }

    if (upperMethod === "POST") {
      const newSkill = {
        _id: "s_" + Date.now(),
        id: "s_" + Date.now(),
        order: skills.length + 1,
        visible: true,
        ...body
      };
      skills.push(newSkill);
      setStorage(STORAGE_KEYS.SKILLS, skills);
      return { success: true, message: "Skill created successfully", data: newSkill };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      skills = skills.map(s => (s._id === subOrId || s.id === subOrId ? { ...s, ...body } : s));
      setStorage(STORAGE_KEYS.SKILLS, skills);
      return { success: true, message: "Skill updated", data: skills.find(s => s._id === subOrId || s.id === subOrId) };
    }

    if (upperMethod === "DELETE") {
      skills = skills.filter(s => s._id !== subOrId && s.id !== subOrId);
      setStorage(STORAGE_KEYS.SKILLS, skills);
      return { success: true, message: "Skill deleted" };
    }
  }

  // 6. EXPERIENCE
  if (resource === "experience") {
    let exp = getStorage(STORAGE_KEYS.EXPERIENCE, initialDump.experiences || []);

    if (upperMethod === "GET") {
      if (subOrId === "visible") {
        return { success: true, data: exp.filter(e => e.visible !== false) };
      }
      return { success: true, data: exp };
    }

    if (upperMethod === "POST") {
      const newExp = {
        _id: "exp_" + Date.now(),
        id: "exp_" + Date.now(),
        order: exp.length + 1,
        visible: true,
        ...body
      };
      exp.unshift(newExp);
      setStorage(STORAGE_KEYS.EXPERIENCE, exp);
      return { success: true, message: "Experience created", data: newExp };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      exp = exp.map(e => (e._id === subOrId || e.id === subOrId ? { ...e, ...body } : e));
      setStorage(STORAGE_KEYS.EXPERIENCE, exp);
      return { success: true, message: "Experience updated", data: exp.find(e => e._id === subOrId || e.id === subOrId) };
    }

    if (upperMethod === "DELETE") {
      exp = exp.filter(e => e._id !== subOrId && e.id !== subOrId);
      setStorage(STORAGE_KEYS.EXPERIENCE, exp);
      return { success: true, message: "Experience deleted" };
    }
  }

  // 7. EDUCATION
  if (resource === "education") {
    let edu = getStorage(STORAGE_KEYS.EDUCATION, initialDump.educations || []);

    if (upperMethod === "GET") {
      if (subOrId === "visible") {
        return { success: true, data: edu.filter(e => e.visible !== false) };
      }
      return { success: true, data: edu };
    }

    if (upperMethod === "POST") {
      const newEdu = {
        _id: "edu_" + Date.now(),
        id: "edu_" + Date.now(),
        order: edu.length + 1,
        visible: true,
        ...body
      };
      edu.push(newEdu);
      setStorage(STORAGE_KEYS.EDUCATION, edu);
      return { success: true, message: "Education created", data: newEdu };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      edu = edu.map(e => (e._id === subOrId || e.id === subOrId ? { ...e, ...body } : e));
      setStorage(STORAGE_KEYS.EDUCATION, edu);
      return { success: true, message: "Education updated", data: edu.find(e => e._id === subOrId || e.id === subOrId) };
    }

    if (upperMethod === "DELETE") {
      edu = edu.filter(e => e._id !== subOrId && e.id !== subOrId);
      setStorage(STORAGE_KEYS.EDUCATION, edu);
      return { success: true, message: "Education deleted" };
    }
  }

  // 8. CERTIFICATIONS
  if (resource === "certifications") {
    let certs = getStorage(STORAGE_KEYS.CERTIFICATIONS, initialDump.certifications || []);

    if (upperMethod === "GET") {
      if (subOrId === "visible") {
        return { success: true, data: certs.filter(c => c.visible !== false) };
      }
      return { success: true, data: certs };
    }

    if (upperMethod === "POST") {
      const newCert = {
        _id: "cert_" + Date.now(),
        id: "cert_" + Date.now(),
        order: certs.length + 1,
        visible: true,
        ...body
      };
      certs.push(newCert);
      setStorage(STORAGE_KEYS.CERTIFICATIONS, certs);
      return { success: true, message: "Certification created", data: newCert };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      certs = certs.map(c => (c._id === subOrId || c.id === subOrId ? { ...c, ...body } : c));
      setStorage(STORAGE_KEYS.CERTIFICATIONS, certs);
      return { success: true, message: "Certification updated", data: certs.find(c => c._id === subOrId || c.id === subOrId) };
    }

    if (upperMethod === "DELETE") {
      certs = certs.filter(c => c._id !== subOrId && c.id !== subOrId);
      setStorage(STORAGE_KEYS.CERTIFICATIONS, certs);
      return { success: true, message: "Certification deleted" };
    }
  }

  // 9. TESTIMONIALS
  if (resource === "testimonials") {
    let tests = getStorage(STORAGE_KEYS.TESTIMONIALS, []);

    if (upperMethod === "GET") {
      if (subOrId === "visible") {
        return { success: true, data: tests.filter(t => t.visible !== false) };
      }
      return { success: true, data: tests };
    }

    if (upperMethod === "POST") {
      const newTest = {
        _id: "test_" + Date.now(),
        id: "test_" + Date.now(),
        visible: true,
        featured: true,
        ...body
      };
      tests.push(newTest);
      setStorage(STORAGE_KEYS.TESTIMONIALS, tests);
      return { success: true, message: "Testimonial created", data: newTest };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      tests = tests.map(t => (t._id === subOrId || t.id === subOrId ? { ...t, ...body } : t));
      setStorage(STORAGE_KEYS.TESTIMONIALS, tests);
      return { success: true, message: "Testimonial updated", data: tests.find(t => t._id === subOrId || t.id === subOrId) };
    }

    if (upperMethod === "DELETE") {
      tests = tests.filter(t => t._id !== subOrId && t.id !== subOrId);
      setStorage(STORAGE_KEYS.TESTIMONIALS, tests);
      return { success: true, message: "Testimonial deleted" };
    }
  }

  // 10. MESSAGES
  if (resource === "messages") {
    let msgs = getStorage(STORAGE_KEYS.MESSAGES, []);

    if (upperMethod === "GET") {
      if (subOrId === "unread-count") {
        return {
          success: true,
          data: { count: msgs.filter(m => !m.read && m.status !== "read").length }
        };
      }
      return {
        success: true,
        data: {
          messages: msgs,
          total: msgs.length,
          unread: msgs.filter(m => !m.read && m.status !== "read").length
        }
      };
    }

    if (upperMethod === "POST") {
      if (action === "reply") {
        msgs = msgs.map(m => (m._id === subOrId || m.id === subOrId ? { ...m, replied: true, replyMessage: body?.replyMessage, status: 'read' } : m));
        setStorage(STORAGE_KEYS.MESSAGES, msgs);
        return { success: true, message: "Reply sent successfully" };
      }

      const newMsg = {
        _id: "msg_" + Date.now(),
        id: "msg_" + Date.now(),
        ...body,
        status: "unread",
        read: false,
        createdAt: new Date().toISOString()
      };
      msgs.unshift(newMsg);
      setStorage(STORAGE_KEYS.MESSAGES, msgs);
      return { success: true, message: "Thank you for reaching out! Your message has been sent successfully.", data: newMsg };
    }

    if (upperMethod === "PATCH" || upperMethod === "PUT") {
      let updateFields = { ...(body || {}) };
      if (action === "read") {
        updateFields.status = "read";
        updateFields.read = true;
      } else if (action === "unread") {
        updateFields.status = "unread";
        updateFields.read = false;
      } else if (action === "archive") {
        updateFields.status = "archived";
      }

      msgs = msgs.map(m => (m._id === subOrId || m.id === subOrId ? { ...m, ...updateFields } : m));
      setStorage(STORAGE_KEYS.MESSAGES, msgs);
      return { success: true, message: "Message updated", data: msgs.find(m => m._id === subOrId || m.id === subOrId) };
    }

    if (upperMethod === "DELETE") {
      msgs = msgs.filter(m => m._id !== subOrId && m.id !== subOrId);
      setStorage(STORAGE_KEYS.MESSAGES, msgs);
      return { success: true, message: "Message deleted" };
    }
  }

  // 11. MEDIA
  if (resource === "media") {
    let media = getStorage(STORAGE_KEYS.MEDIA, initialDump.media || []);

    if (upperMethod === "GET") {
      return {
        success: true,
        data: {
          media: media,
          total: media.length
        }
      };
    }

    if (upperMethod === "POST") {
      const newMedia = {
        _id: "med_" + Date.now(),
        id: "med_" + Date.now(),
        filename: "upload_" + Date.now() + ".jpg",
        url: "/profile.jpg",
        fileType: "image/jpeg",
        size: 150000,
        createdAt: new Date().toISOString()
      };
      media.unshift(newMedia);
      setStorage(STORAGE_KEYS.MEDIA, media);
      return { success: true, message: "File uploaded successfully", data: newMedia };
    }

    if (upperMethod === "DELETE") {
      media = media.filter(m => m._id !== subOrId && m.id !== subOrId);
      setStorage(STORAGE_KEYS.MEDIA, media);
      return { success: true, message: "Media deleted successfully" };
    }
  }

  // 12. RESUME
  // 12. RESUME
  if (resource === "resume") {
    let resumes = getStorage(STORAGE_KEYS.RESUME, initialDump.resumes || []);
    if (!Array.isArray(resumes)) {
      resumes = resumes && resumes.url ? [resumes] : (initialDump.resumes || []);
    }
    const activeResume = resumes.find(r => r.isActive) || resumes[0] || {
      _id: "res_primary",
      filename: "Ajit_Kumar_Resume.pdf",
      originalName: "Ajit_Kumar_Resume.pdf",
      url: "/resume.pdf",
      size: 7737,
      isActive: true,
      updatedAt: new Date().toISOString()
    };

    if (upperMethod === "GET") {
      if (subOrId === "active" || subOrId === "preview" || subOrId === "download") {
        return { success: true, data: activeResume };
      }
      return { success: true, data: resumes };
    }

    if (upperMethod === "POST") {
      const newResume = {
        _id: "res_" + Date.now(),
        id: "res_" + Date.now(),
        filename: body?.filename || "Ajit_Kumar_Resume.pdf",
        originalName: body?.originalName || "Ajit_Kumar_Resume.pdf",
        url: body?.url || "/resume.pdf",
        size: body?.size || 10240,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      resumes = resumes.map(r => ({ ...r, isActive: false }));
      resumes.unshift(newResume);
      setStorage(STORAGE_KEYS.RESUME, resumes);
      return { success: true, message: "Resume uploaded and activated successfully", data: newResume };
    }

    if (upperMethod === "PATCH") {
      const targetId = action === "activate" ? subOrId : subOrId;
      resumes = resumes.map(r => ({
        ...r,
        isActive: r._id === targetId || r.id === targetId
      }));
      setStorage(STORAGE_KEYS.RESUME, resumes);
      return { success: true, message: "Resume activated", data: resumes.find(r => r.isActive) };
    }

    if (upperMethod === "DELETE") {
      resumes = resumes.filter(r => r._id !== subOrId && r.id !== subOrId);
      if (resumes.length > 0 && !resumes.some(r => r.isActive)) {
        resumes[0].isActive = true;
      }
      setStorage(STORAGE_KEYS.RESUME, resumes);
      return { success: true, message: "Resume deleted" };
    }
  }

  // 13. ANALYTICS
  if (resource === "analytics") {
    if (subOrId === "track") {
      return { success: true };
    }

    const projects = getStorage(STORAGE_KEYS.PROJECTS, initialDump.projects || []);
    const skills = getStorage(STORAGE_KEYS.SKILLS, initialDump.skills || []);
    const exp = getStorage(STORAGE_KEYS.EXPERIENCE, initialDump.experiences || []);
    const edu = getStorage(STORAGE_KEYS.EDUCATION, initialDump.educations || []);
    const certs = getStorage(STORAGE_KEYS.CERTIFICATIONS, initialDump.certifications || []);
    const msgs = getStorage(STORAGE_KEYS.MESSAGES, []);
    const media = getStorage(STORAGE_KEYS.MEDIA, initialDump.media || []);
    const settings = getStorage(STORAGE_KEYS.SETTINGS, initialDump.sitesettings[0] || {});
    const profile = getStorage(STORAGE_KEYS.PROFILE, initialDump.profiles[0] || {});
    const allActivity = getStorage(STORAGE_KEYS.ACTIVITY, initialDump.activitylogs || []);

    const pubCount = projects.filter(p => p.status === "published" || p.status === undefined).length;
    const unreadCount = msgs.filter(m => !m.read && m.status !== "read").length;

    // Calculate real dynamic profile completeness
    let score = 0;
    if (profile) {
      if (profile.name) score += 10;
      if (profile.title) score += 10;
      if (profile.bio) score += 15;
      if (profile.profileImage?.url || profile.avatar) score += 15;
      if (profile.location) score += 10;
      if (profile.email) score += 10;
      if (profile.phone) score += 5;
      if (profile.resume?.url || profile.resumeUrl || getStorage(STORAGE_KEYS.RESUME, null)?.url) score += 15;
      if (profile.socialLinks?.github || profile.socialLinks?.linkedin) score += 10;
    }

    const sortedActivity = [...allActivity].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    if (subOrId === "projects") {
      const projects = getStorage(STORAGE_KEYS.PROJECTS, initialDump.projects || []);
      return {
        success: true,
        data: projects.map((p, idx) => ({
          title: p.title,
          slug: p.slug,
          views: Math.max(25 - idx * 5, 5),
        }))
      };
    }

    return {
      success: true,
      data: {
        counts: {
          projects: projects.length,
          publishedProjects: pubCount,
          draftProjects: projects.length - pubCount,
          skills: skills.length,
          experience: exp.length,
          education: edu.length,
          certifications: certs.length,
          testimonials: getStorage(STORAGE_KEYS.TESTIMONIALS, []).length,
          messages: msgs.length,
          unreadMessages: unreadCount,
          media: media.length,
          activity: allActivity.length,
        },
        profile,
        recentProjects: projects.slice(0, 5),
        recentMessages: msgs.slice(0, 5),
        recentActivity: sortedActivity.slice(0, 8),
        profileCompleteness: Math.min(score, 100),
        settings: settings,
        viewsToday: 4,
        viewsThisWeek: 28,
        viewsWeek: 28,
        viewsThisMonth: Math.max(allActivity.length * 3, 64),
        viewsMonth: Math.max(allActivity.length * 3, 64)
      }
    };
  }

  // 14. ACTIVITY
  if (resource === "activity") {
    const logs = getStorage(STORAGE_KEYS.ACTIVITY, initialDump.activitylogs || []);
    return { success: true, data: logs };
  }

  // 15. SEO
  if (resource === "seo") {
    let seo = getStorage(STORAGE_KEYS.SEO, {
      title: "Ajit Kumar | Full Stack MERN Developer & AI Engineer",
      description: "Portfolio of Ajit Kumar - Full Stack MERN Developer skilled in React, Node.js, Express, MongoDB, and Generative AI.",
      keywords: ["Ajit Kumar", "MERN Stack Developer", "React.js", "Node.js", "Generative AI"],
      ogImage: "/profile.jpg",
      twitterHandle: "@ajit0121k",
      canonicalUrl: "https://ajit0121k.github.io/Ajit-Portfolio/",
      robots: "index, follow"
    });

    if (upperMethod === "GET") {
      return { success: true, data: seo };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      seo = { ...seo, ...body };
      setStorage(STORAGE_KEYS.SEO, seo);
      return { success: true, message: "SEO settings updated successfully", data: seo };
    }
  }

  // 16. BLOG
  if (resource === "blog") {
    let posts = getStorage(STORAGE_KEYS.BLOG, initialDump.blogposts || []);

    if (upperMethod === "GET") {
      if (subOrId === "published") {
        const pub = posts.filter(p => p.status === "published" || p.status === undefined);
        return {
          success: true,
          data: {
            posts: pub,
            total: pub.length,
            page: 1,
            totalPages: 1
          }
        };
      }
      if (subOrId === "tags") {
        const allTags = new Set();
        posts.forEach(p => {
          if (Array.isArray(p.tags)) {
            p.tags.forEach(t => allTags.add(t));
          }
        });
        return { success: true, data: Array.from(allTags) };
      }
      if (subOrId === "slug" && action) {
        const found = posts.find(p => p.slug === action);
        return { success: true, data: found || posts[0] || null };
      }
      if (subOrId) {
        const found = posts.find(p => p._id === subOrId || p.id === subOrId || p.slug === subOrId);
        return { success: true, data: found || posts[0] || null };
      }
      return {
        success: true,
        data: {
          posts: posts,
          total: posts.length,
          page: 1,
          totalPages: 1
        }
      };
    }

    if (upperMethod === "POST") {
      const newPost = {
        _id: "blog_" + Date.now(),
        id: "blog_" + Date.now(),
        title: body.title || "Untitled Post",
        slug: body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "post-" + Date.now()),
        excerpt: body.excerpt || "",
        content: body.content || "",
        coverImage: body.coverImage || { url: "/profile.jpg" },
        category: body.category || "Engineering",
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map(t => t.trim()) : []),
        status: body.status || "published",
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        author: { name: "Ajit Kumar" },
        readingTime: "5 min read"
      };
      posts.unshift(newPost);
      setStorage(STORAGE_KEYS.BLOG, posts);
      return { success: true, message: "Blog post created successfully", data: newPost };
    }

    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      posts = posts.map(p => (p._id === subOrId || p.id === subOrId ? { ...p, ...body, updatedAt: new Date().toISOString() } : p));
      setStorage(STORAGE_KEYS.BLOG, posts);
      const updated = posts.find(p => p._id === subOrId || p.id === subOrId) || posts[0];
      return { success: true, message: "Blog post updated successfully", data: updated };
    }

    if (upperMethod === "DELETE") {
      posts = posts.filter(p => p._id !== subOrId && p.id !== subOrId);
      setStorage(STORAGE_KEYS.BLOG, posts);
      return { success: true, message: "Blog post deleted successfully" };
    }
  }

  // 17. GITHUB
  if (resource === "github") {
    if (subOrId === "profile") {
      return {
        success: true,
        data: {
          login: "ajit0121k",
          name: "Ajit Kumar",
          avatar_url: "https://github.com/ajit0121k.png",
          html_url: "https://github.com/ajit0121k",
          public_repos: 12,
          followers: 18,
          following: 15
        }
      };
    }
    if (subOrId === "stats") {
      return {
        success: true,
        data: {
          totalRepos: 12,
          totalStars: 24,
          totalForks: 8,
          followers: 18
        }
      };
    }
    if (subOrId === "repos") {
      return {
        success: true,
        data: [
          { id: 1, name: "smart-resume-screener", html_url: "https://github.com/ajit0121k/smart-resume-screener", description: "AI-Powered Resume Screener & Candidate Ranking Tool" },
          { id: 2, name: "startup-trend-analyzer", html_url: "https://github.com/ajit0121k/startup-trend-analyzer", description: "Full-stack AI web application analyzing tech trends" },
          { id: 3, name: "Ajit-Portfolio", html_url: "https://github.com/ajit0121k/Ajit-Portfolio", description: "Production MERN Full Stack Developer Portfolio & CMS" }
        ]
      };
    }
    if (subOrId === "import") {
      return {
        success: true,
        message: "Repository imported successfully",
        data: {
          title: body.repoName || "Imported Project",
          slug: (body.repoName || "imported-project").toLowerCase(),
          description: "Imported from GitHub repository"
        }
      };
    }
  }

  return { success: true, data: {} };
}
