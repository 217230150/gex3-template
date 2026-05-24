const { createApp, ref, onMounted } = Vue;

const systemConfig = {
  setup() {
    const usr = ref({
      fullName: '',
      dob: '',
      gender: '',
      total: '',
      children: '',
      lodging: '',
      ccName: '',
      ccNum: '',
      ccDate: '',
      ccCode: ''
    });

    const errList = ref({});
    const mainAlert = ref('');
    const renderSummary = ref(false);

    // Using a Map-like dictionary instead of an Array for selections
    const pickedMap = ref({});
    const fetchedData = ref([]);
    
    const apiState = ref({
      loading: false,
      errorText: ''
    });

    const lodgingOpts = [
      'No accommodation needed',
      'Forest View Hotel',
      'Totoro Family Inn',
      'Witch Valley Guesthouse',
      'Luxury Ghibli Resort'
    ];

    onMounted(() => {
      apiState.value.loading = true;
      apiState.value.errorText = '';
      
      // Using fetch with direct resolution instead of separate then/catch
      fetch('ghibli_park.json')
        .then(r => r.json())
        .then(data => {
          fetchedData.value = data;
        })
        .catch(e => {
          apiState.value.errorText = 'Failed to load places. Please try again later.';
        })
        .finally(() => {
          apiState.value.loading = false;
        });
    });

    const toggleMapNode = (node) => {
      // Toggle logic using Dictionary
      if (pickedMap.value[node.id]) {
        delete pickedMap.value[node.id];
      } else {
        pickedMap.value[node.id] = node;
      }
    };

    const validateProcess = () => {
      let passed = true;
      const issues = {};

      // Array-based error format logic
      const addIssue = (key, msg) => {
        if (!issues[key]) issues[key] = [];
        issues[key].push(msg);
        passed = false;
      };

      if (!usr.value.fullName.trim()) addIssue('fullName', 'Full name is required.');
      if (!usr.value.dob) addIssue('dob', 'Date of birth is required.');
      if (!usr.value.gender) addIssue('gender', 'Gender is required.');

      if (Object.keys(pickedMap.value).length === 0) {
        addIssue('parks', 'Please select at least one Ghibli Park place.');
      }

      if (!usr.value.total || usr.value.total < 1) {
        addIssue('total', 'Total visitors must be at least 1.');
      }
      if (usr.value.children === '' || usr.value.children < 0) {
        addIssue('children', 'Number of children cannot be negative.');
      }
      if (parseInt(usr.value.children) > parseInt(usr.value.total)) {
        addIssue('children', 'Children cannot exceed total visitors.');
      }

      if (!usr.value.lodging) addIssue('lodging', 'Accommodation selection is required.');
      if (!usr.value.ccName.trim()) addIssue('ccName', 'Name on card is required.');
      if (!usr.value.ccNum.trim()) addIssue('ccNum', 'Card number is required.');
      if (!usr.value.ccDate) addIssue('ccDate', 'Expiration date is required.');
      if (!usr.value.ccCode.trim()) addIssue('ccCode', 'CVC is required.');

      errList.value = issues;
      return passed;
    };

    const finalizeData = () => {
      errList.value = {};
      mainAlert.value = '';
      renderSummary.value = false;

      if (!validateProcess()) {
        mainAlert.value = 'There are mandatory items pending to be filled. Please complete the required fields.';
      } else {
        renderSummary.value = true;
        setTimeout(() => {
          window.scrollTo(0, 99999);
        }, 150);
      }
    };

    return {
      usr,
      errList,
      mainAlert,
      renderSummary,
      pickedMap,
      fetchedData,
      apiState,
      lodgingOpts,
      toggleMapNode,
      finalizeData
    };
  }
};

createApp(systemConfig).mount('#application-node');