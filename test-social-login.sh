#!/bin/bash
# test-social-login.sh - Test script for social login flow using curl

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set your test variables
BASE_URL="http://localhost:3000"
ENDPOINT="/account/authentication/social_login"
NEW_TEST_EMAIL="test$(date +%s)@example.com"
EXISTING_EMAIL="your-existing-test@example.com" # Replace with a known email in your system

echo -e "${BLUE}Social Login Testing Script${NC}"
echo "========================================"

# Function to test signup
test_signup() {
  echo -e "\n${BLUE}Testing SIGNUP flow with new email: $NEW_TEST_EMAIL${NC}"
  
  curl -s -X POST "$BASE_URL$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{
      \"user\": {
        \"uid\": \"google-uid-$(date +%s)\",
        \"email\": \"$NEW_TEST_EMAIL\",
        \"displayName\": \"Test User\"
      },
      \"isSignUp\": true
    }" | jq .
    
  echo -e "\n${GREEN}Signup test completed${NC}"
}

# Function to test signin with existing account
test_signin() {
  echo -e "\n${BLUE}Testing SIGNIN flow with existing email: $EXISTING_EMAIL${NC}"
  
  curl -s -X POST "$BASE_URL$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{
      \"user\": {
        \"uid\": \"google-uid-$(date +%s)\",
        \"email\": \"$EXISTING_EMAIL\",
        \"displayName\": \"Existing User\"
      },
      \"isSignUp\": false
    }" | jq .
    
  echo -e "\n${GREEN}Signin test completed${NC}"
}

# Function to test what happens if new user attempts to login
test_new_user_login() {
  local random_email="new$(date +%s)@example.com"
  echo -e "\n${BLUE}Testing what happens when new email tries to LOGIN: $random_email${NC}"
  
  curl -s -X POST "$BASE_URL$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{
      \"user\": {
        \"uid\": \"google-uid-$(date +%s)\",
        \"email\": \"$random_email\",
        \"displayName\": \"New User\"
      },
      \"isSignUp\": false
    }" | jq .
    
  echo -e "\n${GREEN}New user login test completed${NC}"
}

# Function to test what happens if existing user attempts to signup
test_existing_user_signup() {
  echo -e "\n${BLUE}Testing what happens when existing email tries to SIGNUP: $EXISTING_EMAIL${NC}"
  
  curl -s -X POST "$BASE_URL$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{
      \"user\": {
        \"uid\": \"google-uid-$(date +%s)\",
        \"email\": \"$EXISTING_EMAIL\",
        \"displayName\": \"Existing User\"
      },
      \"isSignUp\": true
    }" | jq .
    
  echo -e "\n${GREEN}Existing user signup test completed${NC}"
}

# Display usage info
display_usage() {
  echo -e "\n${BLUE}Usage:${NC}"
  echo "  ./test-social-login.sh signup    # Test new user signup"
  echo "  ./test-social-login.sh signin    # Test existing user signin"
  echo "  ./test-social-login.sh new       # Test new user trying to login"
  echo "  ./test-social-login.sh existing  # Test existing user trying to signup"
  echo "  ./test-social-login.sh all       # Run all tests"
}

# Process command line arguments
if [ "$1" = "signup" ]; then
  test_signup
elif [ "$1" = "signin" ]; then
  test_signin
elif [ "$1" = "new" ]; then
  test_new_user_login
elif [ "$1" = "existing" ]; then
  test_existing_user_signup
elif [ "$1" = "all" ]; then
  test_signup
  test_signin
  test_new_user_login
  test_existing_user_signup
else
  echo -e "${RED}Please specify which test to run${NC}"
  display_usage
fi 