const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    // Renamed to match HTML variable names
    const usernameInput = ref("");
    const user = ref(null);
    const userRepos = ref([]);
    const loading = ref(false);
    const errorText = ref("");
    const searchHistory = ref([]);
    let debounceTimer;

    // Function to check if user profile is displayed
    const userDetails = computed(() => {
      return user.value !== null;
    });
    
    // Provide a fallback image URL for the placeholder
    const placeholderImageUrl = "https://placehold.co/300x200?text=Search+GitHub";

    const triggerSearch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (usernameInput.value.trim().length > 2) {
          lookupUser();
        }
      }, 500);
    };

    const lookupUser = async () => {
      if (!usernameInput.value.trim()) return;

      try {
        errorText.value = "";
        loading.value = true;
        user.value = null;
        userRepos.value = [];

        const res = await fetch(
          `https://api.github.com/users/${usernameInput.value.trim()}`
        );

        if (!res.ok) {
          errorText.value = res.status === 404
            ? "User not found. Try again."
            : `Oops: ${res.status} - ${res.statusText}`;
          loading.value = false;
          return;
        }

        const data = await res.json();
        user.value = data;

        if (!searchHistory.value.includes(data.login)) {
          searchHistory.value.unshift(data.login);
          if (searchHistory.value.length > 5) searchHistory.value.pop();
          localStorage.setItem("gitTraceHistory", JSON.stringify(searchHistory.value));
        }

        const repoRes = await fetch(`https://api.github.com/users/${data.login}/repos?sort=updated&per_page=3`);
        if (repoRes.ok) {
          userRepos.value = await repoRes.json();
        }

        usernameInput.value = "";
      } catch (err) {
        errorText.value = "Something went wrong. Please try again.";
        console.error("Error fetching user:", err);
      } finally {
        loading.value = false;
      }
    };

    const usernameInputByHistory = (username) => {
      usernameInput.value = username;
      lookupUser();
    };

    const deleteFromHistory = (username) => {
      searchHistory.value = searchHistory.value.filter(u => u !== username);
      localStorage.setItem("gitTraceHistory", JSON.stringify(searchHistory.value));
    };

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const addHttpsIfNeeded = (url) => {
      if (!url) return "";
      return url.startsWith("http") ? url : `https://${url}`;
    };

    const getLanguageColor = (lang) => {
      const shades = {
        JavaScript: "#f1e05a",
        TypeScript: "#2b7489",
        Python: "#3572A5",
        Java: "#b07219",
        "C#": "#178600",
        PHP: "#4F5D95",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Ruby: "#701516",
        Go: "#00ADD8",
        Swift: "#ffac45",
        Kotlin: "#F18E33",
        Rust: "#dea584",
      };
      return shades[lang] || "#8257e5";
    };

    onMounted(() => {
      const saved = localStorage.getItem("gitTraceHistory");
      if (saved) {
        try {
          searchHistory.value = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse search history:", e);
        }
      }
    });

    return {
      usernameInput,
      user,
      userDetails,
      userRepos,
      loading,
      errorText,
      searchHistory,
      triggerSearch,
      lookupUser,
      usernameInputByHistory,
      deleteFromHistory,
      formatDate,
      addHttpsIfNeeded,
      getLanguageColor,
      placeholderImageUrl,
    };
  },
}).mount("#app");