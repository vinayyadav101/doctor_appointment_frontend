const register = `
        <div class="form-container">
    <h2>Doctor Registration</h2>
    <form id="doctorRegistrationForm" onsubmit="doctorregistrationform(event)">
        <div class="form-row">
            <div class="form-group">
                <label for="doctorName">Doctor Name:</label>
                <input type="text" id="doctorName" name="doctorName" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="specialty">Specialty:</label>
                <input type="text" id="specialty" name="specialty" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender:</label>
                <select id="gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group full-width">
                <label for="address">Address:</label>
                <textarea id="address" name="address" required></textarea>
            </div>
        </div>

        <!-- Swapped Position of Experience and Qualifications -->
        <div class="form-row">
            <div class="form-group">
                <label for="qualifications">Qualifications:</label>
                <input type="text" id="qualifications" name="qualifications" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="experience">Experience (years):</label>
                <input type="number" id="experience" name="experience" min="0" required>
            </div>
            <div class="form-group">
                <label for="consultationFee">Consultation Fee (₹):</label>
                <input type="number" id="consultationFee" name="consultaionFee" min="0" required>
            </div>
        </div>


        <button type="submit">Register</button>
    </form>
</div>
`

const payment = `
<div class="payment-dashboard">

        <div class="dataInNumber">
            <div class="stat-card">
                        <div id="paymentCompletedChart" style="width: 200px; height: 70px;"></div>
            </div>
            <div class="stat-card">
                <div id="paymentRefundeChart" style="width: 200px; height: 70px;"></div>
            </div>
            <div class="payments stat-card">
                <div><img src="../assets/revenue-collection.png" alt="" style="width: 20%;"><span>0</span></div>
            </div>
            <div class="refunds stat-card">
                <div><img src="../assets/refund.png" alt="" style="width: 20%;"><span>0</span></div>
            </div>

        </div>

        <div class="content-container">
            <!-- Payment History Section -->
            <div class="payment-history">
                <div class="search-bar">
                    <input type="text" id="searchOrderId" placeholder="Search by Order ID">
                </div>
                <div class="history-table-wrapper">
                    <table class="history-table" id="paymentHistoryTable">
                        <thead>
                            <tr>
                                <th>payment ID</th>
                                <th>Order ID</th>
                                <th>Appointment ID</th>
                                <th>Date</th>
                                <th>Refund</th>
                            </tr>
                        </thead>
                        <tbody id="paymentHistoryBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `

const appointmnet = `
<div class="appointment-dashboard">

        <div class="appointment-top-container">
            <div class="chart-container">
                <div id="appointmentChart" style="max-width:100%; height:150px" class="paymentGraph-appointment"></div>
                <div id="appointmentUserChart" style="max-width:100%; height:150px"class="paymentGraph-appointment"></div>
            </div>
            <div class="chart-data-container" style="max-width:200px; height:150px">
            <div class="appointment-stat-card completedAppointment">
                <div><img src="../assets/refund.png" alt="" style="width: 20%;"><span>0</span></div>
            </div>
            <div class="appointment-stat-card canceledAppointment">
                <div><img src="../assets/refund.png" alt="" style="width: 20%;"><span>0</span></div>
            </div>
            </div>

        </div>

        <div class="content-container">
            <!-- Payment History Section -->
            <div class="payment-history">
                <div class="search-bar">
                    <input type="text" id="searchOrderId" placeholder="Search by Order ID">
                </div>
                <div class="history-table-wrapper">
                    <table class="history-table" id="paymentHistoryTable">
                        <thead>
                            <tr>
                                <th>patient Email</th>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Date</th>
                                <th>ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="appointmentHistoryBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `


const dashboard = `
<div class="deshboard">

                <div class="dataInNumber">
                    <div class="payments">
                        <div><img src="../assets/revenue-collection.png" alt="" style="width: 20%;"><span>0</span></div>
                    </div>
                    <div class="appointments">
                        <div><img src="../assets/appointment.png" style="width: 20%;"><span>0</span></div>
                    </div>
                    <div class="users">
                        <div><img src="../assets/man.png" alt="" style="width: 20%;"><span>0</span></div>    
                    </div>
                    <div class="doctors">
                        <div><img src="../assets/medical-team.png" alt="" style="width: 20%;"><span>0</span></div>
                    </div>
                </div>

                <div class="dataInGraph">
                    <div class="paymentGraph" style="position: relative;">
                        <div id="dashboardPaymentChart" style="height: 100%;"></div>
                    </div>
                    <div class="appointmentGraph">
                        <div id="dashboardAppointmentChart" style="height: 100%;" ></div>
                    </div>
                </div>
            </div>
            `

const doctors = `
    <div class="doctor-dashboard">
        <div class="search-bar">
            <input type="text" id="searchDoctorName" placeholder="Search by doctor name">
        </div>
        <div class = 'doctor-details-dashboard'  style="display: none;">
            <div class="profile-container">
            <!-- Doctor's Information Section -->
            <div class="doctor-info">
              <div class="doctor-photo-wrapper">
                <img src="" alt="doctor_img" class="doctor-photo avatar">
              </div>
              <div class="doctor-details">
                <h1 class="doctorName">Not mention...</h1>
                <p class="specialty">Not mention...</p>
                <p><strong>Location: </strong><span  class="address"></span></p>
                <p><strong>Consultancy Fee: </strong><span class="consultaionFee"></span></p>
                <p><strong>Professional Background: </strong><span class="qualifications"></span></p>
                <p><strong>Experience: </strong><span class="experience"></span> Plus years</p>
              </div>
            </div>
        
            <!-- Additional Information Section -->
            <div class="additional-info">
              <section>
                <h2>Areas Of Expertise</h2>
                <p class="areas_of_expertise">Not mention...</p>
              </section>
        
              <section>
                <h2>Approach To Patient Care</h2>
                <p class="approach_to_patient_care">Not mention...</p>
              </section>
        
              <section>
                <h2>Fun Fact</h2>
                <p class="fun_fact">Not mention...</p>
              </section>
            </div>
                <!-- Book Appointment Button -->
            <div class="delete-doctor">
              <button id="delete-doctor-btn">Remove Doctor</button>
            </div>
        
            <!-- Review Panel Section -->
            <div class="review-panel">
              <h2>Reviews & Ratings</h2>
        
              <div class="search-bar">
                    <input type="text" id="searchReview" placeholder="Search review by email ID">
                </div>
                <div class="history-table-wrapper">
                    <table class="history-table" id="paymentHistoryTable">
                        <thead>
                            <tr>
                                <th>patient Email</th>
                                <th>Doctor</th>
                            </tr>
                        </thead>
                        <tbody id="appointmentHistoryBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
        
    </div>
`
const users = `
    <div class="doctor-dashboard">
        <div class="search-bar">
            <input type="text" id="searchOrderId" placeholder="Search by Order ID">
        </div>
        <div class = 'doctor-details-dashboard' style="display: none;">
            <div class="profile-container">
            <!-- Doctor's Information Section -->
                <div class="doctor-info">
                  <div class="doctor-photo-wrapper">
                    <img src="" alt="doctor_img" class="doctor-photo avatar">
                  </div>
                    <div class="doctor-details">
                      <h1 class="userName">Not mention...</h1>
                      <p class="email">Not mention...</p>
                      <p><strong>Phone NO: </strong><span  class="phone"></span></p>
                      <p><strong>Created Date: </strong><span  class="createdAt"></span></p>
                      <p><strong>Last Update: </strong><span  class="updatedAt"></span></p>
                      <p><strong>Role: </strong><span class="role"></span></p>
                    </div>
                </div>
        
            <div class="delete-doctor">
              <button id="delete-user-btn">Remove user</button>
            </div>
        
    
            </div>
        </div>
        
    </div>
`