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
  RESUME: "portfolio_cms_resume",
  ACTIVITY: "portfolio_cms_activity",
  VERSION: "portfolio_cms_dump_version",
};

const CURRENT_VERSION = "2026_09_13_v2";

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
    setStorage(STORAGE_KEYS.PROFILE, initialDump.profiles[0] || {});
    setStorage(STORAGE_KEYS.PROJECTS, initialDump.projects || []);
    setStorage(STORAGE_KEYS.SKILLS, initialDump.skills || []);
    setStorage(STORAGE_KEYS.EXPERIENCE, initialDump.experiences || []);
    setStorage(STORAGE_KEYS.EDUCATION, initialDump.educations || []);
    setStorage(STORAGE_KEYS.CERTIFICATIONS, initialDump.certifications || []);
    setStorage(STORAGE_KEYS.SETTINGS, initialDump.sitesettings[0] || {});
    setStorage(STORAGE_KEYS.RESUME, initialDump.resumes[0] || {});
    setStorage(STORAGE_KEYS.MEDIA, initialDump.media || []);
    setStorage(STORAGE_KEYS.ACTIVITY, initialDump.activitylogs || []);
    setStorage(STORAGE_KEYS.TESTIMONIALS, initialDump.testimonials || []);
    setStorage(STORAGE_KEYS.MESSAGES, initialDump.messages || [
      {
        _id: "msg_1",
        name: "Priya Sharma",
        email: "priya.sharma@talentcraft.io",
        subject: "Opportunity: Full-Stack Developer Role",
        message: "Hi Ajit, loved your portfolio and your projects on GitHub. We have an exciting opening for a Full Stack Engineer.",
        status: "unread",
        read: false,
        createdAt: new Date().toISOString()
      }
    ]);
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
    let settings = getStorage(STORAGE_KEYS.SETTINGS, initialDump.sitesettings[0] || {});
    if (upperMethod === "GET") {
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
      msgs = msgs.map(m => (m._id === subOrId || m.id === subOrId ? { ...m, ...body } : m));
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
  if (resource === "resume") {
    let resume = getStorage(STORAGE_KEYS.RESUME, initialDump.resumes[0] || {
      _id: "res_primary",
      filename: "Ajit_Kumar_Resume.pdf",
      url: "/resume.pdf",
      size: 7737,
      isActive: true,
      updatedAt: new Date().toISOString()
    });

    if (upperMethod === "GET") {
      return { success: true, data: resume };
    }

    if (upperMethod === "POST" || upperMethod === "PATCH") {
      resume = { ...resume, ...body, updatedAt: new Date().toISOString() };
      setStorage(STORAGE_KEYS.RESUME, resume);
      return { success: true, message: "Resume updated successfully", data: resume };
    }

    if (upperMethod === "DELETE") {
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

    const pubCount = projects.filter(p => p.status === "published" || p.status === undefined).length;
    const unreadCount = msgs.filter(m => !m.read && m.status !== "read").length;

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
        },
        recentProjects: projects.slice(0, 5),
        recentMessages: msgs.slice(0, 5),
        recentActivity: getStorage(STORAGE_KEYS.ACTIVITY, initialDump.activitylogs || []).slice(0, 8),
        profileCompleteness: 95,
        settings: settings,
        viewsToday: 48,
        viewsWeek: 312,
        viewsMonth: 1240
      }
    };
  }

  // 14. ACTIVITY
  if (resource === "activity") {
    const logs = getStorage(STORAGE_KEYS.ACTIVITY, initialDump.activitylogs || []);
    return { success: true, data: logs };
  }

  return { success: true, data: {} };
}
