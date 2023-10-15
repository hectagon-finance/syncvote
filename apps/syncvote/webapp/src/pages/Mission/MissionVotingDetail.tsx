import { useEffect, useState } from 'react';
import { Card, Button, Progress, Space, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Icon } from 'icon';
import { useParams } from 'react-router-dom';
import { queryAMissionDetail } from '@dal/data';
import { extractIdFromIdString } from 'utils';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import {
  formatDate,
  getTimeElapsedSinceStart,
  getTimeRemainingToEnd,
} from '@utils/helpers';
import ModalListParticipants from './fragments/ModalListParticipants';
import ModalVoterInfo from './fragments/ModalVoterInfo';
import { extractCurrentCheckpointId } from '@utils/helpers';
import MissionProgress from './fragments/MissionProgress';
import VoteSection from './fragments/VoteSection';
import ShowDescription from './fragments/ShowDescription';

const MissionVotingDetail = () => {
  const { missionIdString } = useParams();
  const missionId = extractIdFromIdString(missionIdString);
  const [missionData, setMissionData] = useState<any>();
  const [isReachedQuorum, setIsReachedQuorum] = useState<boolean>();
  const [openModalListParticipants, setOpenModalListParticipants] =
    useState<boolean>(false);
  const [openModalVoterInfo, setOpenModalVoterInfo] = useState<boolean>(false);
  const [listParticipants, setListParticipants] = useState<any[]>([]);
  const [selectedOption, onSelectedOption] = useState<number>(-1);
  const [currentCheckpointData, setCurrentCheckpointData] = useState<any>();
  const [submission, setSubmission] = useState<any>();

  const dispatch = useDispatch();

  const fetchData = () => {
    queryAMissionDetail({
      missionId,
      onSuccess: (data: any) => {
        setMissionData(data);
        console.log('data', data);
        const currentCheckpointId = extractCurrentCheckpointId(data.id);
        const checkpointData = data?.data?.checkpoints.filter(
          (checkpoint: any) => checkpoint.id === currentCheckpointId
        );
        console.log('checkpointData', checkpointData[0]);
        let checkpointDataAfterHandle = checkpointData[0];

        if (!data.isEnd) {
          const startToVote = new Date(data.startToVote);
          // convert second to millisecond of duration
          const duration = checkpointData[0].duration * 1000;
          const endTovote = new Date(
            startToVote.getTime() + duration
          ).toISOString();
          checkpointDataAfterHandle.endToVote = endTovote;
        }

        switch (checkpointData[0]?.vote_machine_type) {
          case 'SingleChoiceRaceToMax':
            if (checkpointData[0]?.includedAbstain === true) {
              checkpointDataAfterHandle.data.options.push('Abstain');
            }
            break;
          case 'UpVote':
            checkpointDataAfterHandle.data.options = [];
            checkpointDataAfterHandle.data.options.push('Upvote');
            if (checkpointData[0]?.includedAbstain === true) {
              checkpointDataAfterHandle.data.options.push('Abstain');
            }
            break;
          case 'Veto':
            checkpointDataAfterHandle.data.options = [];
            checkpointDataAfterHandle.data.options.push('Upvote');
            if (checkpointData[0]?.includedAbstain === true) {
              checkpointDataAfterHandle.data.options.push('Abstain');
            }
            break;
          default:
            break;
        }
        setCurrentCheckpointData(checkpointDataAfterHandle);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error,
        });
      },
      dispatch,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('missionData', missionData);
  }, [missionData, listParticipants]);

  useEffect(() => {
    if (missionData && currentCheckpointData) {
      if (missionData.result) {
        const totalVotingPower = Object.values(missionData.result).reduce(
          (acc: number, voteData: any) => acc + voteData.voting_power,
          0
        );
        if (totalVotingPower >= currentCheckpointData.quorum) {
          setIsReachedQuorum(true);
        }
      }

      if (!missionData.isEnd) {
        setListParticipants(currentCheckpointData.participation.data);
      }
    }
  }, [missionData, selectedOption]);

  return (
    <>
      {missionData && currentCheckpointData && (
        <div className='w-[1033px] flex gap-4'>
          <div className='w-2/3'>
            <div className='flex flex-col mb-10 gap-6'>
              <div className='flex gap-4'>
                <Tag bordered={false} color='green' className='text-base'>
                  Active
                </Tag>
                <Button
                  style={{ border: 'None', padding: '0px', boxShadow: 'None' }}
                  className='text-[#6200EE]'
                  icon={<UploadOutlined />}
                >
                  Share
                </Button>
              </div>
              <div className='flex items-center'>
                <Icon presetIcon='' iconUrl='' size='large' />
                <div className='flex flex-col ml-2'>
                  <p className='font-semibold text-xl	'>{missionData.m_title}</p>
                  <p>Investment Process</p>
                </div>
              </div>
            </div>
            <Space direction='vertical' size={16} className='w-full'>
              <Card className='w-[271px]'>
                <Space direction='horizontal' size={'small'}>
                  <p>Author</p>
                  <Icon iconUrl='' presetIcon='' size='medium' />
                  <p className='w-[168px] truncate ...'>{missionData.author}</p>
                </Space>
              </Card>
              <ShowDescription
                titleDescription={'Proposal content'}
                description={missionData?.m_desc}
              />
              <ShowDescription
                titleDescription={'Checkpoint description'}
                description={currentCheckpointData?.description}
              />
              {!missionData.isEnd && (
                <VoteSection
                  currentCheckpointData={currentCheckpointData}
                  setOpenModalVoterInfo={setOpenModalVoterInfo}
                  onSelectedOption={onSelectedOption}
                  missionData={missionData}
                  setSubmission={setSubmission}
                  submission={submission}
                />
              )}
              {!missionData.isEnd && (
                <Card className='p-4'>
                  <div className='flex flex-col gap-4'>
                    <p className='text-xl font-medium'>Votes</p>
                    <div className='flex'>
                      <p className='w-8/12'>Identity</p>
                      <p className='w-4/12 text-right'>Vote</p>
                    </div>
                    {missionData.vote_record &&
                      missionData.vote_record.map(
                        (record: any, recordIndex: number) => {
                          return (
                            <div className='flex mb-4' key={recordIndex}>
                              <div className='w-8/12 flex items-center gap-2'>
                                <Icon iconUrl='' presetIcon='' size='medium' />
                                <p>{record.identify}</p>
                              </div>
                              {record.option.map(
                                (option: any, optionIndex: number) => {
                                  const voteOption =
                                    option === '-1'
                                      ? 'Abstain'
                                      : currentCheckpointData.data.options[
                                          parseInt(option)
                                        ];
                                  return (
                                    <p
                                      key={optionIndex}
                                      className='w-4/12 text-right'
                                    >
                                      {voteOption}
                                    </p>
                                  );
                                }
                              )}
                            </div>
                          );
                        }
                      )}
                  </div>
                  {/* <div className='w-full flex justify-center items-center'>
                  <Button className='mt-4' icon={<ReloadOutlined />}>
                    View More
                  </Button>
                </div> */}
                </Card>
              )}
            </Space>
          </div>
          <div className='flex-1 flex flex-col gap-4'>
            {missionData?.progress && (
              <MissionProgress progress={missionData?.progress} />
            )}
            {missionData.result ? (
              <Card className=''>
                <p className='mb-6 text-base font-semibold'>Voting results</p>
                {currentCheckpointData.data.options.map(
                  (option: any, index: any) => {
                    // still calculate voting_power of Abstain but not show in result
                    if (option === 'Abstain') {
                      return <div key={-1}></div>;
                    }
                    const totalVotingPower = Object.values(
                      missionData.result
                    ).reduce(
                      (acc: number, voteData: any) =>
                        acc + voteData.voting_power,
                      0
                    );

                    let percentage;
                    if (currentCheckpointData.quorum >= totalVotingPower) {
                      percentage =
                        (missionData.result[index].voting_power /
                          currentCheckpointData.quorum) *
                        100;
                    } else {
                      percentage =
                        (missionData.result[index].voting_power /
                          totalVotingPower) *
                        100;
                    }
                    percentage = parseFloat(percentage.toFixed(2));
                    return (
                      <div key={index} className='flex flex-col gap-2'>
                        <p className='text-base font-semibold'>{option}</p>
                        <p className='text-base'>
                          {missionData.result[option]} votes
                        </p>
                        <Progress percent={percentage} size='small' />
                      </div>
                    );
                  }
                )}
                {isReachedQuorum ? (
                  <div className='w-full flex justify-center items-center mt-2'>
                    <Button className='w-full bg-[#EAF6EE] text-[#29A259]'>
                      Reached required quorum
                    </Button>
                  </div>
                ) : (
                  <div className='w-full flex justify-center items-center mt-2'>
                    <Button className='w-full'>Not reached quorum</Button>
                  </div>
                )}
              </Card>
            ) : (
              <></>
            )}
            {!missionData.isEnd && (
              <Card className=''>
                <p className='mb-4 text-base font-semibold'>
                  Rules & conditions
                </p>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                    <p className='text-base '>Start time</p>
                    <p className='text-base font-semibold'>
                      {getTimeElapsedSinceStart(missionData.startToVote)}
                    </p>
                  </div>
                  <p className='text-right'>
                    {formatDate(missionData.startToVote)}
                  </p>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                    <p className='text-base '>Remaining duration</p>
                    <p className='text-base font-semibold'>
                      {getTimeRemainingToEnd(currentCheckpointData.endToVote)}
                    </p>
                  </div>
                  {missionData.isEnd ? (
                    <></>
                  ) : (
                    <p className='text-right'>
                      {formatDate(currentCheckpointData.endToVote)}
                    </p>
                  )}
                </div>
                <hr className='w-full my-4' />
                <div className='flex justify-between'>
                  <p className='text-base '>Who can vote</p>
                  <p
                    className='text-base font-semibold text-[#6200EE] cursor-pointer'
                    onClick={() => setOpenModalListParticipants(true)}
                  >
                    View details
                  </p>
                </div>
                <hr className='w-full my-4' />
                {currentCheckpointData?.data?.threshold ? (
                  <div>
                    <div className='flex justify-between'>
                      <p className='text-base '>Threshold counted by</p>
                      <p className='text-base font-semibold'>
                        Total votes made
                      </p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-base '>Threshold</p>
                      <p className='text-base font-semibold'>
                        {currentCheckpointData?.data?.threshold}
                      </p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className='flex justify-between'>
                  <p className='text-base '>Quorum</p>
                  <p className='text-base font-semibold'>
                    {currentCheckpointData.quorum} votes
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
      <ModalListParticipants
        open={openModalListParticipants}
        onClose={() => setOpenModalListParticipants(false)}
        listParticipants={listParticipants}
      />
      <ModalVoterInfo
        option={selectedOption === -1 ? [-1] : [selectedOption - 1]}
        open={openModalVoterInfo}
        onClose={() => setOpenModalVoterInfo(false)}
        missionId={missionId}
        listParticipants={listParticipants}
      />
    </>
  );
};

export default MissionVotingDetail;
